import React, { useState, useRef, useCallback, useMemo } from 'react'
import { GridContainer } from './GridContainer'
import type { GridItem, GridContainerProps } from '../types'
import { cn } from '../utils/cn'
import { getAllCollisions } from '../utils/grid'
import { throttle } from '../utils/throttle'

export interface DroppableGridContainerProps extends Omit<GridContainerProps, 'onDrop'> {
  onDrop?: (item: GridItem) => void
  droppingItem?: Partial<GridItem>
}

interface DroppingItemWithPosition extends Partial<GridItem> {
  previewX?: number
  previewY?: number
}

export function DroppableGridContainer({
  onDrop,
  droppingItem = { w: 2, h: 2 },
  className,
  ...props
}: DroppableGridContainerProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null)
  const [isValidPosition, setIsValidPosition] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculatePreviewPosition = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    setIsDraggingOver(true)

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    // Calculate mouse position relative to container
    const containerPadding = props.containerPadding || [0, 0]
    const relativeX = e.clientX - rect.left - containerPadding[0]
    const relativeY = e.clientY - rect.top - containerPadding[1]

    // Calculate grid position
    const cols = props.cols || 12
    const rowHeight = props.rowHeight || 60
    const gap = props.gap || 16
    const margin = props.margin || [gap, gap]
    const containerWidth = rect.width
    
    // Use the same calculation as the drop handler
    const gridWidth = containerWidth - containerPadding[0] * 2
    const totalMarginWidth = (cols - 1) * margin[0]
    const availableWidth = gridWidth - totalMarginWidth
    const unitWidth = availableWidth / cols
    const cellHeight = rowHeight + margin[1]
    
    const gridX = Math.floor(relativeX / (unitWidth + margin[0]))
    const gridY = Math.floor(relativeY / cellHeight)
    
    // Clamp to valid grid positions
    const clampedX = Math.max(0, Math.min(gridX, cols - (droppingItem.w || 2)))
    const clampedY = Math.max(0, gridY)
    
    // Check for collisions
    const previewItem: GridItem = {
      id: 'preview',
      x: clampedX,
      y: clampedY,
      w: droppingItem.w || 2,
      h: droppingItem.h || 2
    }
    
    const collisions = getAllCollisions(props.items, previewItem)
    const hasStaticCollision = props.preventCollision && collisions.some(item => item.static)
    
    setIsValidPosition(!hasStaticCollision)
    setPreviewPosition({ x: clampedX, y: clampedY })
  }, [props.items, props.cols, props.rowHeight, props.gap, props.margin, props.containerPadding, props.preventCollision, droppingItem.w, droppingItem.h])
  
  // Throttle the position calculation for better performance (60fps)
  const throttledCalculatePosition = useMemo(
    () => throttle(calculatePreviewPosition, 16),
    [calculatePreviewPosition]
  )
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    setIsDraggingOver(true)
    throttledCalculatePosition(e)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    // Only set to false if we're leaving the container entirely
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const { clientX, clientY } = e
      const isOutsideBounds = 
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      
      if (isOutsideBounds) {
        setIsDraggingOver(false)
        setPreviewPosition(null)
        setIsValidPosition(true)
      }
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    setPreviewPosition(null)
    setIsValidPosition(true)
    
    // Note: We allow drop even if position is invalid - the handler can decide what to do

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
      <GridContainer
        {...props}
        droppingItem={isDraggingOver && previewPosition ? {
          ...droppingItem,
          previewX: previewPosition.x,
          previewY: previewPosition.y,
          isValidPosition
        } as DroppingItemWithPosition : undefined}
        isExternalDragging={isDraggingOver}
      />
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none" />
      )}
    </div>
  )
}