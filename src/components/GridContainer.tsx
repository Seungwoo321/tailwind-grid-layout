'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '../utils/cn'
import { GridItem, DragState, ResizeState, GridContainerProps } from '../types'
import { getPixelPosition, calculateGridPosition, compactLayout, moveItems, getAllCollisions } from '../utils/grid'
import { GridItemComponent } from './GridItem'
import { getControlPosition, preventDefaultTouchEvent, touchEventOptions } from '../utils/touch'

export const GridContainer: React.FC<GridContainerProps> = ({
  cols = 12,
  rowHeight = 60,
  gap = 16,
  margin,
  containerPadding = [16, 16],
  maxRows,
  isDraggable = true,
  isResizable = true,
  preventCollision = false,
  allowOverlap = false,
  isBounded = true,
  compactType = 'vertical',
  resizeHandles = ['se'],
  draggableCancel,
  autoSize = true,
  verticalCompact: _verticalCompact = true,
  transformScale: _transformScale = 1,
  droppingItem,
  onLayoutChange,
  onDragStart,
  onDrag,
  onDragStop,
  onResizeStart,
  onResize,
  onResizeStop,
  onDrop: _onDrop,
  items,
  children,
  className,
  style
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerWidth, setContainerWidth] = useState(0)
  const [layout, setLayout] = useState<GridItem[]>(items)
  
  // Update layout when items prop changes
  useEffect(() => {
    setLayout(prevLayout => {
      // If items are completely different (e.g., different IDs), replace entirely
      const prevIds = new Set(prevLayout.map(item => item.id))
      const newIds = new Set(items.map(item => item.id))
      const hasNewItems = items.some(item => !prevIds.has(item.id))
      const hasRemovedItems = prevLayout.some(item => !newIds.has(item.id))
      
      if (hasNewItems || hasRemovedItems) {
        // Create a map of existing items with their current positions
        const existingItemsMap = new Map(prevLayout.map(item => [item.id, item]))
        
        // Merge new items with existing positions
        const mergedLayout = items.map(item => {
          const existing = existingItemsMap.get(item.id)
          if (existing) {
            // Keep existing position/size for items that already exist
            return {
              ...item,
              x: existing.x,
              y: existing.y,
              w: existing.w,
              h: existing.h
            }
          }
          // New items keep their original position - THIS IS LINE 123 EQUIVALENT
          return item
        })
        
        return compactLayout(mergedLayout, cols, compactType)
      }
      
      return items
    })
  }, [items, cols, compactType])
  
  // Update container width on mount and resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth - containerPadding[0] * 2
        setContainerWidth(width)
      }
    }

    updateContainerWidth()
    
    // Use ResizeObserver if available
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      const resizeObserver = new ResizeObserver(updateContainerWidth)
      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    } else {
      // Fallback to window resize
      window.addEventListener('resize', updateContainerWidth)
      return () => window.removeEventListener('resize', updateContainerWidth)
    }
  }, [containerPadding])
  
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedItem: null,
    dragOffset: { x: 0, y: 0 },
    placeholder: null,
    originalPosition: null,
    currentMousePos: undefined
  })
  
  const [resizeState, setResizeState] = useState<ResizeState>({
    isResizing: false,
    resizedItem: null,
    resizeHandle: null,
    startSize: { w: 0, h: 0 },
    startPos: { x: 0, y: 0 }
  })

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth - containerPadding[0] * 2)
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [containerPadding])


  // Compact layout after changes
  const updateLayout = useCallback((newLayout: GridItem[]) => {
    const compacted = compactLayout(newLayout, cols, compactType)
    setLayout(compacted)
    onLayoutChange?.(compacted)
  }, [cols, compactType, onLayoutChange])

  // Handle drag start
  const handleDragStart = useCallback((itemId: string, e: React.MouseEvent | React.TouchEvent) => {
    // GridItem already checks isDraggable before calling this function
    const item = layout.find(i => i.id === itemId)!
    // GridItem already checks item.isDraggable before calling this function
    
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = getControlPosition(e.nativeEvent)
    if (!pos) return
    
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
      onDragStart(layout, item, item, { ...item }, e.nativeEvent, element)
    }
    
    e.preventDefault()
    if ('touches' in e.nativeEvent) {
      preventDefaultTouchEvent(e.nativeEvent as TouchEvent)
    }
  }, [layout, onDragStart])

  // Handle drag move
  const handleDragMove = useCallback((e: MouseEvent | TouchEvent) => {
    // This function is only called when dragging is active
    if (!containerRef.current) return
    
    const pos = getControlPosition(e)
    if (!pos) return
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const x = pos.x - containerRect.left - dragState.dragOffset.x - containerPadding[0]
    const y = pos.y - containerRect.top - dragState.dragOffset.y - containerPadding[1]
    
    const { col, row } = calculateGridPosition(x, y, cols, rowHeight, gap, containerWidth, margin)
    
    const draggedItem = layout.find(i => i.id === dragState.draggedItem)
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
    const tempLayout = layout.map(item => 
      item.id === dragState.draggedItem ? { ...item, ...newPosition } : item
    )
    
    // If prevent collision is enabled and allowOverlap is false, don't allow overlapping
    if (preventCollision && !allowOverlap) {
      const collisions = getAllCollisions(tempLayout, { ...draggedItem, ...newPosition })
      const staticCollisions = collisions.filter(item => item.static)
      
      if (staticCollisions.length > 0) {
        // Don't update state or call callbacks if colliding with static items
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
    
    // Prevent default for touch events
    if ('touches' in e) {
      preventDefaultTouchEvent(e as TouchEvent)
    }
  }, [dragState, layout, cols, rowHeight, gap, containerWidth, containerPadding, preventCollision, allowOverlap, isBounded, compactType, margin, maxRows, onDrag])

  // Handle drag end
  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent) => {
    // This function is only called when dragging is active
    
    const draggedItem = layout.find(i => i.id === dragState.draggedItem)
    if (draggedItem && onDragStop && dragState.originalPosition) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${dragState.draggedItem}"]`) as HTMLElement
      if (element) {
        onDragStop(layout, { ...draggedItem, ...dragState.originalPosition }, draggedItem, { ...draggedItem, ...dragState.placeholder }, e, element)
      }
    }
    
    // Use the current layout state which was updated during dragging
    updateLayout(layout)
    
    setDragState({
      isDragging: false,
      draggedItem: null,
      dragOffset: { x: 0, y: 0 },
      placeholder: null,
      originalPosition: null,
      currentMousePos: undefined
    })
  }, [dragState, layout, updateLayout, onDragStop])

  // Handle resize start
  const handleResizeStart = useCallback((
    itemId: string,
    handle: ResizeState['resizeHandle'],
    e: React.MouseEvent | React.TouchEvent
  ) => {
    // ResizeHandle component already checks isResizable before calling this
    const item = layout.find(i => i.id === itemId)!
    const pos = getControlPosition(e.nativeEvent)
    if (!pos) return
    
    setResizeState({
      isResizing: true,
      resizedItem: itemId,
      resizeHandle: handle,
      startSize: { w: item.w, h: item.h },
      startPos: { x: pos.x, y: pos.y },
      originalPos: { x: item.x, y: item.y }
    })
    
    // Call onResizeStart callback
    if (onResizeStart) {
      const element = e.currentTarget as HTMLElement
      onResizeStart(layout, item, item, { ...item }, e.nativeEvent, element)
    }
    
    e.preventDefault()
    e.stopPropagation()
    if ('touches' in e.nativeEvent) {
      preventDefaultTouchEvent(e.nativeEvent as TouchEvent)
    }
  }, [layout, onResizeStart])

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent) => {
    // This function is only called when resizing is active
    
    const item = layout.find(i => i.id === resizeState.resizedItem)
    if (!item) return
    
    const pos = getControlPosition(e)
    if (!pos) return
    
    const horizontalMargin = margin ? margin[0] : gap
    const verticalMargin = margin ? margin[1] : gap
    const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols
    const deltaX = pos.x - resizeState.startPos.x
    const deltaY = pos.y - resizeState.startPos.y
    
    // Use threshold for smoother grid snapping
    const threshold = 0.3 // Snap when 30% into the next grid unit
    
    // Calculate grid unit changes with threshold
    const gridDeltaX = deltaX / (colWidth + horizontalMargin)
    const gridDeltaY = deltaY / (rowHeight + verticalMargin)
    
    // Apply threshold for smoother snapping
    const deltaW = Math.round(gridDeltaX + (gridDeltaX > 0 ? -threshold : threshold))
    const deltaH = Math.round(gridDeltaY + (gridDeltaY > 0 ? -threshold : threshold))
    
    let newW = resizeState.startSize.w
    let newH = resizeState.startSize.h
    let newX = item.x
    let newY = item.y
    
    const originalX = resizeState.originalPos?.x || item.x
    const originalY = resizeState.originalPos?.y || item.y
    
    switch (resizeState.resizeHandle) {
      case 'se':
        newW = resizeState.startSize.w + deltaW
        newH = resizeState.startSize.h + deltaH
        break
      case 'sw':
        newW = resizeState.startSize.w - deltaW
        newH = resizeState.startSize.h + deltaH
        newX = originalX + deltaW
        break
      case 'ne':
        newW = resizeState.startSize.w + deltaW
        newH = resizeState.startSize.h - deltaH
        newY = originalY + deltaH
        break
      case 'nw':
        newW = resizeState.startSize.w - deltaW
        newH = resizeState.startSize.h - deltaH
        newX = originalX + deltaW
        newY = originalY + deltaH
        break
      case 'e':
        newW = resizeState.startSize.w + deltaW
        break
      case 'w':
        newW = resizeState.startSize.w - deltaW
        newX = originalX + deltaW
        break
      case 's':
        newH = resizeState.startSize.h + deltaH
        break
      case 'n':
        newH = resizeState.startSize.h - deltaH
        newY = originalY + deltaH
        break
    }
    
    // Apply min/max constraints
    newW = Math.max(item.minW || 1, newW)
    newH = Math.max(item.minH || 1, newH)
    if (item.maxW) newW = Math.min(newW, item.maxW)
    if (item.maxH) newH = Math.min(newH, item.maxH)
    
    // Ensure position stays within bounds
    newX = Math.max(0, newX)
    newY = Math.max(0, newY)
    
    // Ensure within grid bounds
    newW = Math.min(newW, cols - newX)
    
    const newLayout = layout.map(i => 
      i.id === resizeState.resizedItem
        ? { ...i, x: newX, y: newY, w: newW, h: newH }
        : i
    )
    
    setLayout(newLayout)
    
    // Call onResize callback
    if (onResize && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`) as HTMLElement
      if (element) {
        const originalItem = { ...item, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h }
        const newItem = { ...item, x: newX, y: newY, w: newW, h: newH }
        onResize(newLayout, originalItem, newItem, newItem, e, element)
      }
    }
    
    // Prevent default for touch events
    if ('touches' in e) {
      preventDefaultTouchEvent(e as TouchEvent)
    }
  }, [resizeState, layout, containerWidth, cols, rowHeight, gap, margin, onResize])

  // Handle resize end
  const handleResizeEnd = useCallback((e: MouseEvent | TouchEvent) => {
    // This function is only called when resizing is active
    
    const resizedItem = layout.find(i => i.id === resizeState.resizedItem)
    if (resizedItem && onResizeStop && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`) as HTMLElement
      if (element) {
        const originalItem = { ...resizedItem, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h }
        onResizeStop(layout, originalItem, resizedItem, resizedItem, e, element)
      }
    }
    
    updateLayout(layout)
    
    setResizeState({
      isResizing: false,
      resizedItem: null,
      resizeHandle: null,
      startSize: { w: 0, h: 0 },
      startPos: { x: 0, y: 0 }
    })
  }, [resizeState, layout, updateLayout, onResizeStop])

  // Add global mouse and touch event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      document.addEventListener('mousemove', handleDragMove)
      document.addEventListener('mouseup', handleDragEnd)
      document.addEventListener('touchmove', handleDragMove, touchEventOptions)
      document.addEventListener('touchend', handleDragEnd, touchEventOptions)
      document.addEventListener('touchcancel', handleDragEnd, touchEventOptions)
      document.body.style.cursor = 'grabbing'
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleDragMove)
        document.removeEventListener('mouseup', handleDragEnd)
        document.removeEventListener('touchmove', handleDragMove, touchEventOptions)
        document.removeEventListener('touchend', handleDragEnd, touchEventOptions)
        document.removeEventListener('touchcancel', handleDragEnd, touchEventOptions)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
    }
    // Return undefined when not dragging
    return undefined
  }, [dragState.isDragging, handleDragMove, handleDragEnd])

  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('touchmove', handleResizeMove, touchEventOptions)
      document.addEventListener('touchend', handleResizeEnd, touchEventOptions)
      document.addEventListener('touchcancel', handleResizeEnd, touchEventOptions)
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('touchmove', handleResizeMove, touchEventOptions)
        document.removeEventListener('touchend', handleResizeEnd, touchEventOptions)
        document.removeEventListener('touchcancel', handleResizeEnd, touchEventOptions)
        document.body.style.userSelect = ''
      }
    }
    // Return undefined when not resizing
    return undefined
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd])

  // Calculate grid height
  const verticalMargin = margin ? margin[1] : gap
  const heights = layout.map(item => (item.y + item.h) * (rowHeight + verticalMargin))
  const calculatedHeight = heights.length > 0 ? Math.max(...heights) : 0
  
  // Apply autoSize
  const gridHeight = autoSize ? calculatedHeight : undefined

  return (
    <div
      ref={containerRef}
      className={cn(
        'tailwind-grid-layout relative w-full overflow-auto',
        dragState.isDragging && 'dragging select-none',
        resizeState.isResizing && 'resizing',
        className
      )}
      style={{
        ...(gridHeight !== undefined && { minHeight: gridHeight + containerPadding[1] * 2 }),
        padding: `${containerPadding[1]}px ${containerPadding[0]}px`,
        ...style
      }}
    >
      {/* Grid items */}
      {layout.map(item => {
        const isDragging = dragState.draggedItem === item.id
        let position = getPixelPosition(item, cols, rowHeight, gap, containerWidth, margin)
        
        // If this item is being dragged, position it at the mouse cursor
        if (isDragging && dragState.currentMousePos && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect()
          position = {
            ...position,
            left: dragState.currentMousePos.x - containerRect.left - dragState.dragOffset.x - containerPadding[0],
            top: dragState.currentMousePos.y - containerRect.top - dragState.dragOffset.y - containerPadding[1]
          }
        }
        
        return (
          <GridItemComponent
            key={item.id}
            item={item}
            position={position}
            isDragging={isDragging}
            isResizing={resizeState.resizedItem === item.id}
            isDraggable={isDraggable && item.isDraggable !== false}
            isResizable={isResizable && item.isResizable !== false}
            resizeHandles={resizeHandles}
            draggableCancel={draggableCancel}
            onDragStart={handleDragStart}
            onResizeStart={handleResizeStart}
          >
            {children(item)}
          </GridItemComponent>
        )
      })}
      
      {/* Placeholder during drag - React Grid Layout style */}
      {dragState.isDragging && dragState.placeholder && (
        <div
          className="absolute rounded-lg transition-all duration-300 pointer-events-none"
          style={{
            ...getPixelPosition(dragState.placeholder, cols, rowHeight, gap, containerWidth, margin),
            zIndex: 9,
            background: 'rgba(59, 130, 246, 0.15)',
            border: '2px dashed rgb(59, 130, 246)',
            boxSizing: 'border-box'
          }}
        />
      )}
      
      {/* Placeholder during resize - React Grid Layout style */}
      {resizeState.isResizing && resizeState.resizedItem && (() => {
        const resizedItem = layout.find(i => i.id === resizeState.resizedItem)
        if (!resizedItem) return null
        
        return (
          <div
            className="absolute rounded-lg transition-all duration-200 pointer-events-none"
            style={{
              ...getPixelPosition(resizedItem, cols, rowHeight, gap, containerWidth, margin),
              zIndex: 8,
              background: 'rgba(59, 130, 246, 0.1)',
              border: '2px dashed rgb(59, 130, 246)',
              boxSizing: 'border-box'
            }}
          />
        )
      })()}
      
      {/* Dropping Item Preview */}
      {droppingItem && !dragState.isDragging && (
        <div
          className="absolute bg-gray-200 border-2 border-dashed border-gray-400 rounded opacity-75 pointer-events-none flex items-center justify-center"
          style={{
            width: ((droppingItem.w || 1) * containerWidth / cols) - gap,
            height: ((droppingItem.h || 1) * rowHeight) - gap,
            left: containerPadding[0],
            top: containerPadding[1]
          }}
        >
          <span className="text-gray-600 font-medium">Drop here</span>
        </div>
      )}
    </div>
  )
}