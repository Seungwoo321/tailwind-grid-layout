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
        setContainerWidth(containerRef.current.offsetWidth)
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
    startPos: { x: 0, y: 0 },
    currentPixelSize: { w: 0, h: 0 },
    currentPixelPos: { x: 0, y: 0 }
  })

  // Update container width on mount and resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
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
  const handleDragStart = useCallback((itemId: string, e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    // GridItem already checks isDraggable before calling this function
    const item = layout.find(i => i.id === itemId)!
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
      onDragStart(layout, item, item, { ...item }, e.nativeEvent, element)
    }
    
    // Don't call preventDefault here as it's already handled in GridItem for touch events
    // This allows mouse events to work normally
    if (!('touches' in e.nativeEvent)) {
      e.preventDefault()
    }
  }, [layout, onDragStart])

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
  }, [dragState, layout, cols, rowHeight, gap, containerWidth, containerPadding, preventCollision, allowOverlap, isBounded, compactType, margin, maxRows, onDrag])

  // Handle drag end
  const handleDragEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
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
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    // ResizeHandle component already checks isResizable before calling this
    const item = layout.find(i => i.id === itemId)!
    const pos = getControlPosition(e.nativeEvent)
    if (!pos) return
    
    // Calculate initial pixel size
    const horizontalMargin = margin ? margin[0] : gap
    const verticalMargin = margin ? margin[1] : gap
    const gridWidth = containerWidth - containerPadding[0] * 2
    const colWidth = (gridWidth - horizontalMargin * (cols - 1)) / cols
    const gridUnitW = colWidth + horizontalMargin
    const gridUnitH = rowHeight + verticalMargin
    
    setResizeState({
      isResizing: true,
      resizedItem: itemId,
      resizeHandle: handle,
      startSize: { w: item.w, h: item.h },
      startPos: { x: pos.x, y: pos.y },
      originalPos: { x: item.x, y: item.y },
      currentPixelSize: { 
        w: item.w * colWidth + (item.w - 1) * horizontalMargin,
        h: item.h * rowHeight + (item.h - 1) * verticalMargin
      },
      currentPixelPos: {
        x: item.x * gridUnitW,
        y: item.y * gridUnitH
      }
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
  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    // This function is only called when resizing is active
    
    const item = layout.find(i => i.id === resizeState.resizedItem)
    if (!item) return
    
    const pos = getControlPosition(e)
    if (!pos) return
    
    const horizontalMargin = margin ? margin[0] : gap
    const verticalMargin = margin ? margin[1] : gap
    const gridWidth = containerWidth - containerPadding[0] * 2
    const colWidth = (gridWidth - horizontalMargin * (cols - 1)) / cols
    
    const gridUnitW = colWidth + horizontalMargin
    const gridUnitH = rowHeight + verticalMargin
    
    // Calculate continuous pixel deltas from start position
    const pixelDeltaX = pos.x - resizeState.startPos.x
    const pixelDeltaY = pos.y - resizeState.startPos.y
    
    
    // Get initial pixel values - these are always set in handleResizeStart
    const startPixelW = resizeState.currentPixelSize!.w
    const startPixelH = resizeState.currentPixelSize!.h
    const startPixelX = resizeState.currentPixelPos!.x
    const startPixelY = resizeState.currentPixelPos!.y
    
    // Calculate new pixel dimensions based on handle
    let newPixelX = startPixelX
    let newPixelY = startPixelY
    let newPixelW = startPixelW
    let newPixelH = startPixelH
    
    // 단순한 그리드 기반 리사이즈로 접근
    // 마우스 델타를 그리드 단위로 변환
    const gridDeltaX = pixelDeltaX / gridUnitW
    const gridDeltaY = pixelDeltaY / gridUnitH
    
    // 현재 그리드 크기
    let newGridW = resizeState.startSize.w
    let newGridH = resizeState.startSize.h
    let newGridX = resizeState.originalPos?.x || item.x
    let newGridY = resizeState.originalPos?.y || item.y
    
    // 핸들에 따른 그리드 크기 조정
    switch (resizeState.resizeHandle) {
      case 'se': {
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'sw': {
        const deltaW = Math.round(gridDeltaX)
        newGridX = Math.max(0, (resizeState.originalPos?.x || item.x) + deltaW)
        newGridW = Math.max(1, resizeState.startSize.w - deltaW)
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'ne': {
        const deltaH = Math.round(gridDeltaY)
        newGridY = Math.max(0, (resizeState.originalPos?.y || item.y) + deltaH)
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        newGridH = Math.max(1, resizeState.startSize.h - deltaH)
        break
      }
      case 'nw': {
        const deltaW = Math.round(gridDeltaX)
        const deltaH = Math.round(gridDeltaY)
        newGridX = Math.max(0, (resizeState.originalPos?.x || item.x) + deltaW)
        newGridY = Math.max(0, (resizeState.originalPos?.y || item.y) + deltaH)
        newGridW = Math.max(1, resizeState.startSize.w - deltaW)
        newGridH = Math.max(1, resizeState.startSize.h - deltaH)
        break
      }
      case 'e': {
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        break
      }
      case 'w': {
        const deltaW = Math.round(gridDeltaX)
        newGridX = Math.max(0, (resizeState.originalPos?.x || item.x) + deltaW)
        newGridW = Math.max(1, resizeState.startSize.w - deltaW)
        break
      }
      case 's': {
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'n': {
        const deltaH = Math.round(gridDeltaY)
        newGridY = Math.max(0, (resizeState.originalPos?.y || item.y) + deltaH)
        newGridH = Math.max(1, resizeState.startSize.h - deltaH)
        break
      }
    }
    
    // 경계 제한 적용
    newGridX = Math.max(0, Math.min(cols - newGridW, newGridX))
    newGridW = Math.min(newGridW, cols - newGridX)
    
    // 픽셀 크기로 다시 계산 (표시용)
    newPixelX = newGridX * gridUnitW
    newPixelY = newGridY * gridUnitH
    newPixelW = newGridW * colWidth + (newGridW - 1) * horizontalMargin
    newPixelH = newGridH * rowHeight + (newGridH - 1) * verticalMargin
    
    // 그리드 기반으로 직접 계산된 값 사용 (minW/maxW 제약 조건 적용)
    const constrainedW = Math.min(Math.max(item.minW || 1, newGridW), item.maxW || Infinity)
    const constrainedH = Math.max(item.minH || 1, Math.min(newGridH, item.maxH || Infinity))
    const constrainedX = Math.max(0, Math.min(cols - constrainedW, newGridX))
    const constrainedY = Math.max(0, newGridY)
    
    
    const newLayout = layout.map(i => 
      i.id === resizeState.resizedItem
        ? { ...i, x: constrainedX, y: constrainedY, w: constrainedW, h: constrainedH }
        : i
    )
    
    setLayout(newLayout)
    
    // Update pixel positions for smooth resizing
    setResizeState(prev => ({
      ...prev,
      currentPixelSize: { w: newPixelW, h: newPixelH },
      currentPixelPos: { x: newPixelX, y: newPixelY }
    }))
    
    // Call onResize callback
    if (onResize && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`) as HTMLElement
      if (element) {
        const originalItem = { ...item, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h }
        const newItem = { ...item, x: constrainedX, y: constrainedY, w: constrainedW, h: constrainedH }
        onResize(newLayout, originalItem, newItem, newItem, e, element)
      }
    }
    
    // Prevent default for touch events to stop scrolling during drag
    if ('touches' in e) {
      e.preventDefault()
    }
  }, [resizeState, layout, containerWidth, cols, rowHeight, gap, margin, onResize])

  // Handle resize end
  const handleResizeEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
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
      startPos: { x: 0, y: 0 },
      currentPixelSize: { w: 0, h: 0 },
      currentPixelPos: { x: 0, y: 0 }
    })
  }, [resizeState, layout, updateLayout, onResizeStop])

  // Add global mouse, touch, and pointer event listeners
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

  useEffect(() => {
    if (resizeState.isResizing) {
      // Mouse events
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      
      // Touch events
      document.addEventListener('touchmove', handleResizeMove, touchEventOptions)
      document.addEventListener('touchend', handleResizeEnd, touchEventOptions)
      document.addEventListener('touchcancel', handleResizeEnd, touchEventOptions)
      
      // Pointer events (for better dev tools support)
      document.addEventListener('pointermove', handleResizeMove)
      document.addEventListener('pointerup', handleResizeEnd)
      document.addEventListener('pointercancel', handleResizeEnd)
      
      document.body.style.userSelect = 'none'
      
      return () => {
        document.removeEventListener('mousemove', handleResizeMove)
        document.removeEventListener('mouseup', handleResizeEnd)
        document.removeEventListener('touchmove', handleResizeMove, touchEventOptions)
        document.removeEventListener('touchend', handleResizeEnd, touchEventOptions)
        document.removeEventListener('touchcancel', handleResizeEnd, touchEventOptions)
        document.removeEventListener('pointermove', handleResizeMove)
        document.removeEventListener('pointerup', handleResizeEnd)
        document.removeEventListener('pointercancel', handleResizeEnd)
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
        const isResizing = resizeState.resizedItem === item.id
        let position = getPixelPosition(item, cols, rowHeight, gap, containerWidth, margin, containerPadding)
        
        // If this item is being dragged, position it at the mouse cursor
        if (isDragging && dragState.currentMousePos && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect()
          position = {
            ...position,
            left: dragState.currentMousePos.x - containerRect.left - dragState.dragOffset.x - containerPadding[0],
            top: dragState.currentMousePos.y - containerRect.top - dragState.dragOffset.y - containerPadding[1]
          }
        }
        
        // If this item is being resized, use pixel position for smooth resizing
        if (isResizing && resizeState.currentPixelSize && resizeState.currentPixelPos) {
          position = {
            left: resizeState.currentPixelPos.x,
            top: resizeState.currentPixelPos.y,
            width: resizeState.currentPixelSize.w,
            height: resizeState.currentPixelSize.h
          }
        }
        
        return (
          <GridItemComponent
            key={item.id}
            item={item}
            position={position}
            isDragging={isDragging}
            isResizing={isResizing}
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
            ...getPixelPosition(dragState.placeholder, cols, rowHeight, gap, containerWidth, margin, containerPadding),
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
              ...getPixelPosition(resizedItem, cols, rowHeight, gap, containerWidth, margin, containerPadding),
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
            width: ((droppingItem.w || 1) * (containerWidth - containerPadding[0] * 2) / cols) - gap,
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