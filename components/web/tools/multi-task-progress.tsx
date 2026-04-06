import { Check, Loader2, X, Trash2 } from "lucide-react"
import { Button } from "~/components/common/button"
import { motion, AnimatePresence } from "framer-motion"
import { Task } from "~/hooks/useStreamingTask"

interface MultiTaskProgressProps {
  tasks: Record<string, Task>
  onCancelTask: (taskId: string) => void
  onClearTask: (taskId: string) => void
  onClearAllTasks: () => void
}

const Model_List = [
  { Value: "lite", Name: "CORE" },
  { Value: "pro", Name: "ADVANCED" },
  { Value: "ultra", Name: "ELITE" },
  { Value: "ultra2x", Name: "PRIME" },
]

export function MultiTaskProgress({ tasks, onCancelTask, onClearTask, onClearAllTasks }: MultiTaskProgressProps) {
  const activeTasks = Object.values(tasks).filter(task => task.status === 'running')
  const completedTasks = Object.values(tasks).filter(task => task.status === 'completed')
  const hasAnyTasks = Object.keys(tasks).length > 0

  if (!hasAnyTasks) return null

  return (
    <div className="fixed bottom-4 right-4 w-96 max-h-96 bg-white dark:bg-card rounded-2xl shadow-lg border border-border overflow-hidden z-50">
      <div className="p-4 border-b border-border bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">Active Deep Scans</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {activeTasks.length} active, {completedTasks.length} completed
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAllTasks}
              className="w-6 h-6 p-0"
              title="Clear All Tasks"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        <AnimatePresence>
          {Object.values(tasks).map((task) => (
            <motion.div
              key={task.task_id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-border last:border-b-0"
            >
              <div className="p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {Model_List.find(m => m.Value === task.model)?.Name || "CORE"}
                      </span>
                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-md uppercase tracking-wider ${
                        task.status === 'running' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                          : task.status === 'completed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                          : task.status === 'error'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                          : 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {task.query}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {task.status === 'running' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onCancelTask(task.task_id)}
                        className="w-6 h-6 p-0"
                        title="Cancel Task"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                    {(task.status === 'completed' || task.status === 'error' || task.status === 'cancelled') && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onClearTask(task.task_id)}
                        className="w-6 h-6 p-0"
                        title="Clear Task"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress Stages */}
                <div className="space-y-1">
                  {task.stages.slice(-3).map((stage) => (
                    <div key={stage.id} className="flex items-center gap-2">
                      <div className="flex-shrink-0 w-3 h-3 rounded-full border flex items-center justify-center">
                        {stage.status === 'completed' ? (
                          <Check className="w-2 h-2 text-green-600" />
                        ) : stage.status === 'in_progress' ? (
                          <Loader2 className="w-2 h-2 text-blue-600 animate-spin" />
                        ) : (
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                        )}
                      </div>
                      <span className={`text-xs truncate ${
                        stage.status === 'completed' 
                          ? 'text-green-600' 
                          : stage.status === 'in_progress' 
                          ? 'text-blue-600 font-medium' 
                          : 'text-gray-400'
                      }`}>
                        {stage.text}
                      </span>
                      {stage.progress !== undefined && (
                        <span className="text-xs text-muted-foreground ml-auto">
                          {stage.progress}%
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {task.error && (
                  <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                    <p className="text-xs text-red-600 dark:text-red-400">{task.error}</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
