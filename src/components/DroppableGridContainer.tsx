import React, { useState, useRef } from 'react'
import { GridContainer } from './GridContainer'
import type { GridItem, GridContainerProps } from '../types'
import { cn } from '../utils/cn'

export interface DroppableGridContainerProps extends GridContainerProps {
  onDrop?: (item: GridItem) => void
  droppingItem?: Partial<GridItem>
}

export function DroppableGridContainer({
  onDrop,
  droppingItem = { w: 2, h: 2 },
  className,
  ...props
}: DroppableGridContainerProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
    setIsDraggingOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the container entirely
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setIsDraggingOver(false)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)

    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const droppedData = JSON.parse(data)
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return

      // Calculate grid position from drop coordinates
      const relativeX = e.clientX - rect.left
      const relativeY = e.clientY - rect.top

      // Calculate grid units
      const cols = props.cols || 12
      const rowHeight = props.rowHeight || 60
      const gap = props.gap || 16
      const cellWidth = rect.width / cols
      const cellHeight = rowHeight + gap
      
      const gridX = Math.floor(relativeX / cellWidth)
      const gridY = Math.floor(relativeY / cellHeight)

      const newItem: GridItem = {
        id: droppedData.id || `dropped-${Date.now()}`,
        x: Math.max(0, Math.min(gridX, cols - (droppingItem.w || 2))),
        y: Math.max(0, gridY),
        w: droppingItem.w || 2,
        h: droppingItem.h || 2,
        ...droppedData,
      }

      onDrop?.(newItem)
    } catch (error) {
      console.error('Failed to parse dropped data:', error)
    }
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative',
        isDraggingOver && 'ring-2 ring-blue-500 ring-offset-2 rounded-lg',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <GridContainer {...props} />
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}