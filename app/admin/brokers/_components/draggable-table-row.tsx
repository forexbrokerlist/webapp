"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import type { Row } from "@tanstack/react-table"
import type { ReactNode } from "react"
import { TableCell, TableRow } from "~/components/common/table"
import { getColumnPinningStyle } from "~/lib/data-table"
import { flexRender } from "@tanstack/react-table"

interface DraggableTableRowProps<TData> {
  row: Row<TData>
  children?: ReactNode
}

export function DraggableTableRow<TData>({ row }: DraggableTableRowProps<TData>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
  })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 120ms cubic-bezier(0.2, 0, 0, 1)",
    opacity: isDragging ? 0.3 : 1,
    zIndex: isDragging ? 50 : 0,
    position: "relative",
    cursor: isDragging ? "grabbing" : "grab",
  }

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      {...attributes}
      {...listeners}
      className="group/row select-none"
    >
      {row.getVisibleCells().map(cell => (
        <TableCell
          key={cell.id}
          style={getColumnPinningStyle({ column: cell.column, withBorder: true })}
        >
          {cell.column.id === "drag-handle" ? (
            <div
              className="flex size-full items-center justify-center group-hover/row:opacity-100 transition-opacity"
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          ) : (
            flexRender(cell.column.columnDef.cell, cell.getContext())
          )}
        </TableCell>
      ))}
    </TableRow>
  )
}
