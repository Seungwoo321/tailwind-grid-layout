'use client'

import React from 'react'
import { cn } from '../utils/cn'
import { GridItem, ResizeState } from '../types'
import { ResizeHandle } from './ResizeHandle'

interface GridItemComponentProps {
  item: GridItem
  position: { left: number; top: number; width: number; height: number }
  isDragging: boolean
  isResizing: boolean
  isColliding?: boolean
  isDraggable: boolean
  isResizable: boolean
  resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>
  draggableCancel?: string
  onDragStart: (itemId: string, e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => void
  onResizeStart: (itemId: string, handle: ResizeState['resizeHandle'], e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => void
  children: React.ReactNode
}

export const GridItemComponent: React.FC<GridItemComponentProps> = ({
  item,
  position,
  isDragging,
  isResizing,
  isColliding = false,
  isDraggable,
  isResizable,
  resizeHandles = ['se'],
  draggableCancel,
  onDragStart,
  onResizeStart,
  children
}) => {
  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    // Don't allow dragging static items
    if (item.static) return

    // Only initiate drag if clicking on the drag handle or if no specific handle is defined
    const target = e.target as HTMLElement
    const isDragHandle = target.closest('.grid-drag-handle')
    const isActionButton = target.closest('.grid-actions, button, a')

    // Check if clicking on resize handle - don't start drag
    const isResizeHandle = target.closest('.react-grid-layout__resize-handle') || target.closest('[data-testid^="resize-handle-"]')
    if (isResizeHandle) {
      return
    }

    // Check draggableCancel selector
    const isCancelled = draggableCancel && target.closest(draggableCancel)


    if (isDraggable && (isDragHandle || !target.closest('.grid-drag-handle')) && !isActionButton && !isCancelled) {

      // For touch events, we need to call preventDefault to prevent scrolling
      // But we should do it before calling onDragStart to ensure the event is not consumed
      if ('touches' in e) {
        e.preventDefault()
      }

      onDragStart(item.id, e)
    }
  }

  return (
    <div
      data-grid-id={item.id}
      className={cn(
        'absolute isolate',
        !isDragging && 'transition-all duration-200',
        isDragging && 'opacity-80 z-50 cursor-grabbing shadow-2xl',
        isResizing && 'z-40',
        isColliding && 'ring-1 ring-gray-400 shadow-inner',
        !isDragging && !isResizing && 'hover:z-30',
        !isDragging && (item.static ? 'cursor-not-allowed' : (isDraggable ? 'cursor-grab' : 'cursor-default')),
        item.className
      )}
      style={{
        left: `${position.left}px`,
        top: `${position.top}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        transform: isDragging ? 'scale(1.02)' : 'scale(1)'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={(e) => {
        // Call handleMouseDown with synthetic event
        handleMouseDown(e)
        // Stop propagation to prevent bubbling issues
        e.stopPropagation()
      }}
      onDoubleClick={(e) => e.preventDefault()}
    >
      {/* Content wrapper with lower z-index to ensure resize handles are always on top */}
      <div className="relative z-0 h-full w-full">
        {children}
      </div>

      {/* Resize handles */}
      {isResizable && (
        <>
          {resizeHandles.map(handle => (
            <ResizeHandle
              key={handle}
              position={handle}
              onMouseDown={(e) => onResizeStart(item.id, handle, e)}
              isActive={true}
              isVisible={['se', 'sw', 'ne', 'nw'].includes(handle)}
            />
          ))}
        </>
      )}
    </div>
  )
}