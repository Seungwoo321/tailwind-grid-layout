'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { GridItem, DragState } from '../types'
import { getControlPosition, touchEventOptions } from '../utils/touch'
import { calculateGridPosition, compactLayout, moveItems, getAllCollisions } from '../utils/grid'

export interface UseDragOptions {
  cols: number
  rowHeight: number
  gap: number
  margin?: [number, number]
  containerPadding: [number, number]
  containerWidth: number
  maxRows?: number
  preventCollision: boolean
  allowOverlap: boolean
  isBounded: boolean
  compactType: 'vertical' | 'horizontal' | 'none'
  layout: GridItem[]
  setLayout: React.Dispatch<React.SetStateAction<GridItem[]>>
  updateLayout: (layout: GridItem[]) => void
  containerRef: React.RefObject<HTMLDivElement>
  onDragStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDrag?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDragStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
}

export interface UseDragReturn {
  dragState: DragState
  handleDragStart: (
    itemId: string,
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => void
}

const initialDragState: DragState = {
  isDragging: false,
  draggedItem: null,
  dragOffset: { x: 0, y: 0 },
  placeholder: null,
  originalPosition: null,
  currentMousePos: undefined
}

export function useDrag({
  cols,
  rowHeight,
  gap,
  margin,
  containerPadding,
  containerWidth,
  maxRows,
  preventCollision,
  allowOverlap,
  isBounded,
  compactType,
  layout,
  setLayout,
  updateLayout,
  containerRef,
  onDragStart,
  onDrag,
  onDragStop
}: UseDragOptions): UseDragReturn {
  const [dragState, setDragState] = useState<DragState>(initialDragState)

  // Use ref to always have latest layout in event handlers
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  // Handle drag start
  const handleDragStart = useCallback((
    itemId: string,
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    // GridItem already checks isDraggable before calling this function
    const item = layoutRef.current.find(i => i.id === itemId)!
    // GridItem already checks item.isDraggable before calling this function

    const rect = e.currentTarget.getBoundingClientRect()
    const pos = getControlPosition(e.nativeEvent as MouseEvent | TouchEvent | PointerEvent)

    if (!pos) {
      return
    }

    const newDragState = {
      isDragging: true,
      draggedItem: itemId,
      dragOffset: {
        x: pos.x - rect.left,
        y: pos.y - rect.top
      },
      placeholder: { ...item },
      originalPosition: { ...item },
      currentMousePos: { x: pos.x, y: pos.y }
    }

    setDragState(newDragState)

    // Call onDragStart callback
    if (onDragStart) {
      const element = e.currentTarget as HTMLElement
      onDragStart(layoutRef.current, item, item, { ...item }, e.nativeEvent, element)
    }

    // Don't call preventDefault here as it's already handled in GridItem for touch events
    // This allows mouse events to work normally
    if (!('touches' in e.nativeEvent)) {
      e.preventDefault()
    }
  }, [onDragStart])

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    // This function is only called when dragging is active
    if (!containerRef.current) return

    const pos = getControlPosition(e)
    if (!pos) return

    const containerRect = containerRef.current.getBoundingClientRect()
    const x = pos.x - containerRect.left - dragState.dragOffset.x - containerPadding[0]
    const y = pos.y - containerRect.top - dragState.dragOffset.y - containerPadding[1]

    const { col, row } = calculateGridPosition(x, y, cols, rowHeight, gap, containerWidth, margin)

    const draggedItem = layoutRef.current.find(i => i.id === dragState.draggedItem)
    if (!draggedItem || draggedItem.static) return

    const newPosition = {
      x: Math.max(0, Math.min(cols - draggedItem.w, col)),
      y: Math.max(0, row),
      w: draggedItem.w,
      h: draggedItem.h
    }

    // Apply maxRows constraint
    if (maxRows && newPosition.y + newPosition.h > maxRows) {
      newPosition.y = Math.max(0, maxRows - newPosition.h)
    }

    // Apply bounded constraints
    if (isBounded) {
      newPosition.x = Math.max(0, Math.min(cols - newPosition.w, newPosition.x))
      newPosition.y = Math.max(0, newPosition.y)
    }

    // Check for collisions
    const tempLayout = layoutRef.current.map(item =>
      item.id === dragState.draggedItem ? { ...item, ...newPosition } : item
    )

    // If prevent collision is enabled and allowOverlap is false, don't allow overlapping
    if (preventCollision && !allowOverlap) {
      const collisions = getAllCollisions(tempLayout, { ...draggedItem, ...newPosition })

      if (collisions.length > 0) {
        // Don't update state or call callbacks if colliding with any items
        return
      }
    }

    // Move other items if needed
    let finalLayout = tempLayout
    if (!preventCollision && !allowOverlap) {
      const itemWithNewPosition = { ...draggedItem, ...newPosition }
      // originalPosition is always set when drag starts
      const originalPosition = dragState.originalPosition
      const originalWithId = { ...draggedItem, ...originalPosition }
      finalLayout = moveItems(tempLayout, itemWithNewPosition, cols, originalWithId)
    }

    // Compact the layout
    const compactedLayout = compactLayout(finalLayout, cols, compactType)
    setLayout(compactedLayout)

    setDragState(prev => ({
      ...prev,
      placeholder: newPosition,
      currentMousePos: pos
    }))

    // Call onDrag callback
    if (onDrag && dragState.originalPosition) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${dragState.draggedItem}"]`) as HTMLElement
      if (element) {
        onDrag(compactedLayout, { ...draggedItem, ...dragState.originalPosition }, { ...draggedItem, ...newPosition }, { ...draggedItem, ...newPosition }, e, element)
      }
    }

    // Prevent default for touch events to stop scrolling during drag
    if ('touches' in e) {
      e.preventDefault()
    }
  }, [dragState, cols, rowHeight, gap, containerWidth, containerPadding, preventCollision, allowOverlap, isBounded, compactType, margin, maxRows, onDrag, setLayout, containerRef])

  // Handle drag end
  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    // This function is only called when dragging is active

    const draggedItem = layoutRef.current.find(i => i.id === dragState.draggedItem)
    if (draggedItem && onDragStop && dragState.originalPosition) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${dragState.draggedItem}"]`) as HTMLElement
      if (element) {
        onDragStop(layoutRef.current, { ...draggedItem, ...dragState.originalPosition }, draggedItem, { ...draggedItem, ...dragState.placeholder }, e, element)
      }
    }

    // Use the current layout state which was updated during dragging
    updateLayout(layoutRef.current)

    setDragState(initialDragState)
  }, [dragState, updateLayout, onDragStop, containerRef])

  // Set up event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      // Mouse events
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)

      // Touch events
      document.addEventListener('touchmove', handleDragMove, touchEventOptions)
      document.addEventListener('touchend', handleDragEnd, touchEventOptions)
      document.addEventListener('touchcancel', handleDragEnd, touchEventOptions)

      // Pointer events (for better dev tools support)
      document.addEventListener('pointermove', handleDragMove)
      document.addEventListener('pointerup', handleDragEnd)
      document.addEventListener('pointercancel', handleDragEnd)

      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      document.body.classList.add('grid-dragging')

      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
        document.removeEventListener('touchmove', handleDragMove, touchEventOptions)
        document.removeEventListener('touchend', handleDragEnd, touchEventOptions)
        document.removeEventListener('touchcancel', handleDragEnd, touchEventOptions)
        document.removeEventListener('pointermove', handleDragMove)
        document.removeEventListener('pointerup', handleDragEnd)
        document.removeEventListener('pointercancel', handleDragEnd)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        document.body.classList.remove('grid-dragging')
      }
    }
    // Return undefined when not dragging
    return undefined
  }, [dragState.isDragging, dragState.draggedItem, dragState.dragOffset, handleDragMove, handleDragEnd])

  return {
    dragState,
    handleDragStart
  }
}
