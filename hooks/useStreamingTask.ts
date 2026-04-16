import { useState, useRef, useCallback, useEffect } from 'react'
import { apiClient, getSignedToken } from '~/lib/api-client'
import { useSession } from '~/lib/auth-client'

export interface TaskStage {
  id: string
  text: string
  status: 'pending' | 'in_progress' | 'completed'
  progress?: number
}

export interface Task {
  task_id: string
  query: string
  model: string
  status: 'running' | 'completed' | 'error' | 'cancelled'
  stages: TaskStage[]
  created_at: string
  result?: any
  error?: string
}

interface UseStreamingTaskReturn {
  tasks: Record<string, Task>
  startTask: (query: string, model: string) => Promise<string>
  cancelTask: (taskId: string) => void
  clearTask: (taskId: string) => void
  clearAllTasks: () => void
  getActiveTasks: () => Task[]
  pollTask: (taskId: string, backendTaskId?: string, query?: string, model?: string) => void
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const POLL_INTERVAL_MS = 20000
const FALLBACK_HISTORY_PAGE_SIZE = 20


function extractAnswer(data: any) {
  return (
    data?.answer ||
    data?.Deep_Research_answer ||
    data?.deep_research_answer ||
    data?.result?.answer ||
    null
  )
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useStreamingTask(): UseStreamingTaskReturn {
  const { data: session } = useSession()
  // Keep userId in a ref so callbacks always see the latest value without
  // needing to be re-created every time the session changes.
  const userIdRef = useRef<string | undefined>(session?.user?.id)
  userIdRef.current = session?.user?.id

  const [tasks, setTasks] = useState<Record<string, Task>>({})
  // Use a ref to track the latest tasks state for stable polling without triggers
  const tasksRef = useRef<Record<string, Task>>(tasks)
  tasksRef.current = tasks

  // controllers map: taskId → AbortController (stream), `poll-<backendId>` → AbortController (poll)
  const controllers = useRef(new Map<string, AbortController>())
  const isGlobalPollingActive = useRef(false)

  // ---------------------------------------------------------------------------
  // Helpers – all operate on taskId and do NOT read from `tasks` state
  // (avoids stale-closure issues).
  // ---------------------------------------------------------------------------
  const initializeTask = useCallback((taskId: string, query: string, model: string) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: {
        task_id: taskId,
        query,
        model,
        status: 'running',
        stages: [
          { id: '1', text: 'Initializing deep scan...', status: 'pending' },
          { id: '2', text: 'Waiting for backend response...', status: 'pending' },
        ],
        created_at: new Date().toISOString(),
      },
    }))
  }, [])

  const updateTaskStage = useCallback((taskId: string, message: string, progress?: number) => {
    setTasks(prev => {
      const task = prev[taskId]
      if (!task) return prev

      const updatedStages = [...task.stages]
      const existingIdx = updatedStages.findIndex(s => s.text === message)

      if (existingIdx === -1) {
        updatedStages.push({
          id: Date.now().toString(),
          text: message,
          status: 'in_progress',
          progress: progress ?? undefined,
        })
      } else if (progress !== undefined) {
        updatedStages[existingIdx] = { ...updatedStages[existingIdx], progress }
      }

      return { ...prev, [taskId]: { ...task, stages: updatedStages } }
    })
  }, [])

  const markStageCompleted = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev[taskId]
      if (!task) return prev

      const updatedStages = [...task.stages]
      // Mark the last in-progress stage as completed
      for (let i = updatedStages.length - 1; i >= 0; i--) {
        if (updatedStages[i].status === 'in_progress') {
          updatedStages[i] = { ...updatedStages[i], status: 'completed' }
          break
        }
      }

      return { ...prev, [taskId]: { ...task, stages: updatedStages } }
    })
  }, [])

  const abortControllers = useCallback((taskId: string, backendTaskId?: string) => {
    controllers.current.get(taskId)?.abort()
    controllers.current.delete(taskId)
    if (backendTaskId) {
      const pollKey = `poll-${backendTaskId}`
      controllers.current.get(pollKey)?.abort()
      controllers.current.delete(pollKey)
    }
  }, [])

  const completeTask = useCallback((taskId: string, data: any, backendTaskId?: string) => {
    setTasks(prev => {
      const task = prev[taskId]
      if (!task) return prev
      return {
        ...prev,
        [taskId]: {
          ...task,
          status: 'completed',
          result: data,
          stages: task.stages.map(s => ({ ...s, status: 'completed' as const })),
        },
      }
    })
    abortControllers(taskId, backendTaskId)
  }, [abortControllers])

  const errorTask = useCallback((taskId: string, error: string, backendTaskId?: string) => {
    setTasks(prev => {
      const task = prev[taskId]
      if (!task) return prev
      return { ...prev, [taskId]: { ...task, status: 'error', error } }
    })
    abortControllers(taskId, backendTaskId)
  }, [abortControllers])

  // ---------------------------------------------------------------------------
  // Centralized Global Polling Loop
  // Ensures only one poll (either status or history) is active at a time
  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // Centralized Global Polling logic
  // Read current running tasks and update state in one go
  // ---------------------------------------------------------------------------
  const runGlobalPoll = useCallback(async () => {
    if (isGlobalPollingActive.current) return
    const userId = userIdRef.current
    if (!userId) return

    const currentTasks = tasksRef.current
    const activeTaskIds = Object.keys(currentTasks).filter(id => currentTasks[id].status === 'running')
    if (activeTaskIds.length === 0) return

    isGlobalPollingActive.current = true
    try {
      console.log(`[useStreamingTask] Global poll trigger at 20s interval for ${activeTaskIds.length} tasks...`)
      const response = await apiClient.get(
        `/deep-research/v1/history?created_by=${userId}&page=1&limit=${FALLBACK_HISTORY_PAGE_SIZE}`
      )

      const historyList: any[] = 
        response.data?.data?.history ?? 
        response.data?.history ?? 
        response.data?.data ?? 
        []

      if (Array.isArray(historyList)) {
        setTasks(prev => {
          let updated = { ...prev }
          let changed = false

          activeTaskIds.forEach(taskId => {
            const task = updated[taskId]
            if (!task) return
            const backendId = task.task_id 
            
            const record = historyList.find(
              (item: any) => item.task_id === backendId || item.task_id === taskId
            )

            if (record) {
              const answer = extractAnswer(record)
              const status = record.status || record.status_message
              
              if (answer && task.status === 'running') {
                updated[taskId] = {
                  ...task,
                  status: 'completed',
                  result: {
                    answer,
                    full_report: record.Deep_Research_answer ?? record.deep_research_answer ?? answer,
                    response: { short_response: answer },
                  },
                  stages: task.stages.map(s => ({ ...s, status: 'completed' as const })),
                }
                changed = true
              } else if (status && status !== 'in_progress' && status !== 'running') {
                if (status === 'error' || status === 'failed') {
                  updated[taskId] = { ...task, status: 'error', error: 'Task failed in backend' }
                  changed = true
                }
              }
            }
          })

          return changed ? updated : prev
        })
      }
    } catch (err) {
      console.error('[useStreamingTask] Global poll error:', err)
    } finally {
      isGlobalPollingActive.current = false
    }
  }, []) // Stable dependency array

  // Periodic polling effect
  useEffect(() => {
    const hasActiveTasks = Object.keys(tasksRef.current).some(id => tasksRef.current[id].status === 'running')
    if (!hasActiveTasks) return

    console.log('[useStreamingTask] Polling effect stable (20s interval)')
    const interval = setInterval(() => {
      runGlobalPoll()
    }, POLL_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [runGlobalPoll]) // runGlobalPoll is stable

  const pollTask = useCallback((
    taskId: string,
    backendTaskId?: string,
    providedQuery?: string,
    providedModel?: string,
  ) => {
    // Ensure the task exists in state (handles the "reconnect" scenario)
    setTasks(prev => {
      if (prev[taskId]) return prev
      return {
        ...prev,
        [taskId]: {
          task_id: taskId,
          query: providedQuery ?? 'Previous query',
          model: providedModel ?? 'lite',
          status: 'running',
          stages: [{ id: 'poll-init', text: 'Reconnecting to live progress…', status: 'in_progress' }],
          created_at: new Date().toISOString(),
        },
      }
    })
  }, [])

  const handleCompletionFallback = useCallback((
    taskId: string,
    backendId: string,
    query?: string,
    model?: string,
  ) => {
    console.log(`[useStreamingTask] Registering fallback for ${backendId}`)
    updateTaskStage(taskId, 'Research completed. Finalizing report…', 100)
    markStageCompleted(taskId)
    
    // The global poll will pick this up on its next tick
    pollTask(taskId, backendId, query, model)
  }, [updateTaskStage, markStageCompleted, pollTask])

  // ---------------------------------------------------------------------------
  // SSE stream
  // ---------------------------------------------------------------------------
  const startTask = useCallback(async (query: string, model: string): Promise<string> => {
    const taskId = Date.now().toString()
    const controller = new AbortController()
    controllers.current.set(taskId, controller)

    initializeTask(taskId, query, model)

    const processStream = async (response: Response) => {
      const reader = response.body?.getReader()
      if (!reader) throw new Error('ReadableStream not supported')

      const decoder = new TextDecoder()
      let buffer = ''
      let backendTaskId: string | undefined

      try {
        while (true) {
          const { value, done } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const events = buffer.split('\n\n')
          buffer = events.pop() ?? ''

          for (const raw of events) {
            if (!raw.startsWith('data:')) continue

            let json: any
            try {
              json = JSON.parse(raw.replace(/^data:\s*/, ''))
            } catch {
              console.error('[useStreamingTask] Failed to parse SSE event:', raw)
              continue
            }

            // Capture backend task ID on first occurrence
            if (!backendTaskId && json?.data?.task_id) {
              backendTaskId = json.data.task_id
              setTasks(prev => {
                const t = prev[taskId]
                if (t && t.task_id !== backendTaskId) {
                  return { ...prev, [taskId]: { ...t, task_id: backendTaskId! } }
                }
                return prev
              })
              // Start backup polling now that we have a concrete backend ID
              pollTask(taskId, backendTaskId, query, model)
            }

            const { type, data } = json

            if (type === 'research.task_submitted') {
              updateTaskStage(taskId, data.message, data.progress)
            } else if (type === 'research.status' || type === 'enhancement.status') {
              updateTaskStage(taskId, data.message, data.progress)
              if (data.status && data.status !== 'queued') {
                markStageCompleted(taskId)
              }
            }

            const isCompleted =
              data.status === 'completed' ||
              type?.includes('completed') ||
              data.progress === 100

            if (isCompleted) {
              const answer = extractAnswer(data)
              if (answer) {
                completeTask(taskId, data, backendTaskId)
              } else {
                handleCompletionFallback(taskId, backendTaskId ?? taskId, query, model)
              }
              return
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      // Stream ended without a terminal event – ensure polling is active
      setTasks(prev => {
        if (prev[taskId]?.status === 'running') {
          console.log(`[useStreamingTask] Stream ended without terminal event for ${taskId}; ensuring poll`)
          pollTask(taskId, backendTaskId, query, model)
        }
        return prev
      })
    }

    try {
      const apiKey = await getSignedToken()
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? ''

      const response = await fetch(`${baseUrl}/deep-research/v1/query-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apiKey,
          Accept: 'text/event-stream',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ query: query.trim(), model, created_by: userIdRef.current, use_async: true }),
        signal: controller.signal,
      })

      if (!response.ok) throw new Error(`API returned status ${response.status}`)

      processStream(response).catch(err => {
        if (err.name !== 'AbortError') {
          console.error('[useStreamingTask] Stream processing error:', err)
          errorTask(taskId, err.message ?? 'Unknown error occurred')
        }
      })

      return taskId
    } catch (err: any) {
      if (err.name !== 'AbortError') errorTask(taskId, err.message ?? 'Failed to start task')
      throw err
    }
  }, [initializeTask, updateTaskStage, markStageCompleted, completeTask, errorTask, pollTask, handleCompletionFallback])

  // ---------------------------------------------------------------------------
  // Cancel / clear
  // ---------------------------------------------------------------------------
  const cancelTask = useCallback((taskId: string) => {
    controllers.current.get(taskId)?.abort()
    controllers.current.delete(taskId)

    setTasks(prev => {
      const task = prev[taskId]
      if (!task) return prev
      return { ...prev, [taskId]: { ...task, status: 'cancelled' } }
    })
  }, [])

  const clearTask = useCallback((taskId: string) => {
    cancelTask(taskId)
    setTasks(prev => {
      const next = { ...prev }
      delete next[taskId]
      return next
    })
  }, [cancelTask])

  const clearAllTasks = useCallback(() => {
    controllers.current.forEach(c => c.abort())
    controllers.current.clear()
    setTasks({})
  }, [])

  const getActiveTasks = useCallback(() => {
    return Object.values(tasks).filter(t => t.status === 'running')
  }, [tasks])

  return { tasks, startTask, cancelTask, clearTask, clearAllTasks, getActiveTasks, pollTask }
}