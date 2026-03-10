"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ToolStatus } from "~/.generated/prisma/browser"
import { Badge } from "~/components/common/badge"
import { Button } from "~/components/common/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/common/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/common/select"
import { Stack } from "~/components/common/stack"
import { orpc } from "~/lib/orpc-query"
import { toast } from "sonner"

interface BrokerStatusUpdateProps {
  brokerId: number
  currentStatus: ToolStatus
  publishedAt?: Date | null
}

const statusConfig = {
  [ToolStatus.Draft]: {
    label: "Draft",
    variant: "soft" as const,
    description: "Not published, only visible to admins"
  },
  [ToolStatus.Pending]: {
    label: "Pending",
    variant: "warning" as const,
    description: "Submitted for review"
  },
  [ToolStatus.Scheduled]: {
    label: "Scheduled",
    variant: "info" as const,
    description: "Scheduled for future publication"
  },
  [ToolStatus.Published]: {
    label: "Published",
    variant: "success" as const,
    description: "Publicly visible"
  }
}

export function BrokerStatusUpdate({ brokerId, currentStatus, publishedAt }: BrokerStatusUpdateProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<ToolStatus>(currentStatus)
  const queryClient = useQueryClient()

  const updateStatusMutation = useMutation(
    orpc.brokers.updateStatus.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: orpc.brokers.key() })
        toast.success("Broker status updated successfully")
        window.location.reload()
      },
      onError: (error: any) => {
        toast.error(`Failed to update status: ${error.message}`)
      }
    })
  )

  const handleUpdate = async () => {
    if (selectedStatus === currentStatus) {
      setIsOpen(false)
      return
    }

    updateStatusMutation.mutate({
      id: brokerId,
      status: selectedStatus,
      publishedAt: selectedStatus === ToolStatus.Published ? new Date() : null
    })
  }

  const currentConfig = statusConfig[currentStatus]

  return (
    <>
      <Stack direction="column" className="gap-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Status:</span>
          <Badge variant={currentConfig.variant} size="sm">
            {currentConfig.label}
          </Badge>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="w-fit"
        >
          Update Status
        </Button>
      </Stack>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Broker Status</DialogTitle>
          </DialogHeader>
          
          <Stack direction="column" className="gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">New Status</label>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as ToolStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <Badge variant={config.variant} size="sm">
                          {config.label}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {config.description}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {publishedAt && (
              <div className="text-sm text-muted-foreground">
                Current publish date: {new Date(publishedAt).toLocaleDateString()}
              </div>
            )}

            <Stack direction="row" className="gap-2 justify-end">
              <Button
                variant="secondary"
                onClick={() => setIsOpen(false)}
                disabled={updateStatusMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={updateStatusMutation.isPending || selectedStatus === currentStatus}
                isPending={updateStatusMutation.isPending}
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  )
}
