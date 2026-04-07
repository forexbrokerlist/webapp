import { useState, useRef, useCallback } from 'react'
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
const POLL_INTERVAL_MS = 3000
const FALLBACK_MAX_ATTEMPTS = 10
const FALLBACK_BASE_DELAY_MS = 3_000
const FALLBACK_MAX_DELAY_MS = 30_000
const FALLBACK_HISTORY_PAGE_SIZE = 20

function getFallbackDelay(attempt: number): number {
  // Exponential backoff: 3s, ~4.7s, ~7.5s, ~11s … capped at 30s
  return Math.min(FALLBACK_MAX_DELAY_MS, FALLBACK_BASE_DELAY_MS * Math.pow(1.5, attempt))
}

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
  // controllers map: taskId → AbortController (stream), `poll-<backendId>` → AbortController (poll)
  const controllers = useRef(new Map<string, AbortController>())

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
  // History fallback
  // Polls the history endpoint until the completed research appears or we give up.
  // ---------------------------------------------------------------------------
  const handleCompletionFallback = useCallback(async (
    taskId: string,
    backendId: string,
    query?: string,
    model?: string,
  ) => {
    const controllerKey = `poll-${backendId}`
    const signal = controllers.current.get(controllerKey)?.signal

    console.log(`[useStreamingTask] Starting history fallback for ${backendId} (local: ${taskId})`)
    updateTaskStage(taskId, 'Research completed. Finalizing report…', 100)
    markStageCompleted(taskId)

    for (let attempt = 0; attempt < FALLBACK_MAX_ATTEMPTS; attempt++) {
      if (signal?.aborted) return

      const delay = getFallbackDelay(attempt)
      await new Promise(resolve => setTimeout(resolve, delay))

      if (signal?.aborted) return

      const userId = userIdRef.current
      if (!userId) {
        console.warn('[useStreamingTask] Skipping history poll: userId not available yet')
        continue
      }

      try {
        const response = await apiClient.get(
          `/deep-research/v1/history?created_by=${userId}&page=1&limit=${FALLBACK_HISTORY_PAGE_SIZE}`,
          { signal },
        )

        const historyList: any[] =
          response.data?.data?.history ??
          response.data?.history ??
          response.data?.data ??
          []

        if (!Array.isArray(historyList)) {
          console.warn('[useStreamingTask] Unexpected history shape', response.data)
          continue
        }

        const record = historyList.find(
          (item: any) => item.task_id === backendId || item.task_id === taskId,
        )

        const answer = extractAnswer(record)
        if (answer) {
          console.log('[useStreamingTask] Found completed research in history')
          completeTask(
            taskId,
            {
              answer,
              full_report: record.Deep_Research_answer ?? record.deep_research_answer ?? answer,
              response: { short_response: answer },
            },
            backendId,
          )
          return
        }

        console.log(`[useStreamingTask] Attempt ${attempt + 1}: record not ready yet`)
      } catch (err: any) {
        if (err.name === 'AbortError') return
        console.error(`[useStreamingTask] History fallback attempt ${attempt + 1} failed:`, err)
        // Continue to next attempt; backoff handles timing.
      }
    }

    // Exhausted all attempts
    console.error(`[useStreamingTask] Gave up after ${FALLBACK_MAX_ATTEMPTS} history polls for ${backendId}`)
    errorTask(taskId, 'Could not retrieve results. Please try again.', backendId)
  }, [updateTaskStage, markStageCompleted, completeTask, errorTask])

  // ---------------------------------------------------------------------------
  // Polling (status endpoint) – used as a backup alongside the SSE stream
  // ---------------------------------------------------------------------------
  const pollTask = useCallback((
    taskId: string,
    backendTaskId?: string,
    providedQuery?: string,
    providedModel?: string,
  ) => {
    const controllerKey = backendTaskId ? `poll-${backendTaskId}` : taskId
    // Bail out if we're already polling this task
    if (controllers.current.has(controllerKey)) return

    const controller = new AbortController()
    controllers.current.set(controllerKey, controller)

    const effectiveBackendId = backendTaskId || taskId

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

    const poll = async () => {
      if (controller.signal.aborted) return

      try {
        const response = await apiClient.get(
          `/deep-research/v1/status?task_id=${effectiveBackendId}`,
          { signal: controller.signal },
        )

        // The API occasionally returns a raw SSE string instead of JSON
        let data = response.data?.data ?? response.data
        if (typeof data === 'string' && data.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(data.replace(/^data:\s*/, '').trim())
            data = parsed.data ?? parsed
          } catch {
            console.warn('[useStreamingTask] Failed to parse string status response')
          }
        }

        if (!data) {
          setTimeout(poll, POLL_INTERVAL_MS)
          return
        }

        if (data.message || data.status_message) {
          updateTaskStage(taskId, data.message ?? data.status_message, data.progress)
        }

        const terminalStatuses = new Set(['completed', 'success', 'error', 'failed'])
        const inProgressStatuses = new Set(['queued', 'running', 'in_progress'])
        if (data.status && !inProgressStatuses.has(data.status)) {
          markStageCompleted(taskId)
        }

        const isCompleted =
          data.status === 'completed' ||
          data.status === 'success' ||
          data.type === 'research.completed' ||
          data.progress === 100

        if (isCompleted) {
          const answer = extractAnswer(data)
          if (answer) {
            completeTask(taskId, data.result ?? data, effectiveBackendId)
          } else {
            handleCompletionFallback(taskId, effectiveBackendId, providedQuery, providedModel)
          }
          controllers.current.delete(controllerKey)
          return
        }

        if (data.status === 'error' || data.status === 'failed') {
          errorTask(taskId, data.error ?? 'Task failed', effectiveBackendId)
          controllers.current.delete(controllerKey)
          return
        }

        if (!terminalStatuses.has(data.status)) {
          setTimeout(poll, POLL_INTERVAL_MS)
        }
      } catch (err: any) {
        if (err.name === 'AbortError') return

        if (err.response?.status === 404) {
          console.log(`[useStreamingTask] Status 404 for ${effectiveBackendId} – falling back to history`)
          handleCompletionFallback(taskId, effectiveBackendId, providedQuery, providedModel)
          controllers.current.delete(controllerKey)
          return
        }

        // Transient error – keep polling
        setTimeout(poll, POLL_INTERVAL_MS)
      }
    }

    poll()
  }, [updateTaskStage, markStageCompleted, completeTask, errorTask, handleCompletionFallback])

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