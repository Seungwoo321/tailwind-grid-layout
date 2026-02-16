import React, { useState, useRef, useCallback, useMemo } from 'react'
import { GridContainer } from './GridContainer'
import type { GridItem, GridContainerProps } from '../types'
import { cn } from '../utils/cn'
import { throttle } from '../utils/throttle'
import { checkCollision } from '../utils/grid'

export interface DroppableGridContainerProps extends Omit<GridContainerProps, 'onDrop'> {
  onDrop?: (item: GridItem) => void
  droppingItem?: Partial<GridItem>
}

interface DragPreviewState {
  x: number
  y: number
  isValid: boolean
}

export function DroppableGridContainer({
  onDrop,
  droppingItem = { w: 2, h: 2 },
  className,
  ...props
}: DroppableGridContainerProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const [previewState, setPreviewState] = useState<DragPreviewState | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const calculateGridPosition = useCallback((e: React.DragEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return null
    
    const containerPadding = props.containerPadding || [16, 16]
    const cols = props.cols || 12
    const rowHeight = props.rowHeight || 60
    const gap = props.gap || 16
    
    // Calculate relative position accounting for container padding
    const relativeX = e.clientX - rect.left - containerPadding[0]
    const relativeY = e.clientY - rect.top - containerPadding[1]
    
    // Calculate cell dimensions
    const gridWidth = rect.width - containerPadding[0] * 2
    // Use the same calculation as grid utils
    const cellWidth = (gridWidth - gap * (cols - 1)) / cols
    const cellWithGap = cellWidth + gap
    const cellHeight = rowHeight + gap
    
    // Convert to grid coordinates
    const gridX = Math.floor(relativeX / cellWithGap)
    const gridY = Math.floor(relativeY / cellHeight)
    
    // Apply boundaries
    const x = Math.max(0, Math.min(gridX, cols - (droppingItem.w || 2)))
    const y = Math.max(0, gridY)
    
    return { x, y }
  }, [props.cols, props.rowHeight, props.gap, props.containerPadding, droppingItem])

  const handleDragOverThrottled = useMemo(
    () => throttle((e: React.DragEvent) => {
      const position = calculateGridPosition(e)
      if (!position) return
      
      // Check collision with existing items
      const previewItem = {
        id: 'preview',
        x: position.x,
        y: position.y,
        w: droppingItem.w || 2,
        h: droppingItem.h || 2
      }
      
      const hasCollision = props.items.some(item => 
        checkCollision(previewItem, item)
      )
      
      setPreviewState({
        x: position.x,
        y: position.y,
        isValid: !hasCollision
      })
    }, 16), // 60fps
    [calculateGridPosition, props.items, droppingItem]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
    setIsDraggingOver(true)
    handleDragOverThrottled(e)
  }, [handleDragOverThrottled])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only set to false if we're leaving the container entirely
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) {
      // If we can't get the rect, don't hide overlay
      return
    }
    
    const { clientX, clientY } = e
    const isOutsideBounds = 
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    
    if (isOutsideBounds) {
      setIsDraggingOver(false)
      setPreviewState(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDraggingOver(false)
    setPreviewState(null)

    const data = e.dataTransfer.getData('application/json')
    if (!data) return

    try {
      const droppedData = JSON.parse(data)
      
      // Use the calculated position from preview state if available
      const position = previewState || calculateGridPosition(e)
      if (!position) return
      
      // Only allow drop if valid
      if (previewState && !previewState.isValid) {
        console.warn('Cannot drop item at invalid position')
        return
      }

      const newItem: GridItem = {
        id: droppedData.id || `dropped-${Date.now()}`,
        x: position.x,
        y: position.y,
        w: droppingItem.w || 2,
        h: droppingItem.h || 2,
        ...droppedData,
      }

      onDrop?.(newItem)
    } catch (error) {
      console.error('Failed to parse dropped data:', error)
    }
  }, [previewState, calculateGridPosition, droppingItem, onDrop])

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
        droppingItem={
          isDraggingOver && previewState
            ? {
                ...droppingItem,
                previewX: previewState.x,
                previewY: previewState.y,
                isValid: previewState.isValid
              }
            : undefined
        }
        isExternalDragging={isDraggingOver}
      />
      {isDraggingOver && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none z-50" />
      )}
    </div>
  )
}