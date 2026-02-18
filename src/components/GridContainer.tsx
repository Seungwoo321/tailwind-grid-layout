'use client'

import React, { useRef, useState, useCallback, useEffect } from 'react'
import { cn } from '../utils/cn'
import { GridItem, GridContainerProps } from '../types'
import { getPixelPosition, compactLayout } from '../utils/grid'
import { GridItemComponent } from './GridItem'
import { useResize } from '../hooks/useResize'
import { useDrag } from '../hooks/useDrag'

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
  preserveInitialHeight = false,
  verticalCompact: _verticalCompact = true,
  transformScale: _transformScale = 1,
  droppingItem,
  isExternalDragging = false,
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

  // Store initial height for preserveInitialHeight feature
  // Uses same calculation as autoSize for consistency
  const initialHeightRef = useRef<number | null>(null)
  if (preserveInitialHeight && initialHeightRef.current === null) {
    const vertMargin = margin ? margin[1] : gap
    const heights = items.map(item => (item.y + item.h) * (rowHeight + vertMargin))
    initialHeightRef.current = heights.length > 0 ? Math.max(...heights) : 0
  }
  
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

  // Compact layout after changes
  const updateLayout = useCallback((newLayout: GridItem[]) => {
    const compacted = compactLayout(newLayout, cols, compactType)
    setLayout(compacted)
    onLayoutChange?.(compacted)
  }, [cols, compactType, onLayoutChange])

  // Use the resize hook
  const { resizeState, handleResizeStart } = useResize({
    cols,
    rowHeight,
    gap,
    margin,
    containerPadding,
    containerWidth,
    layout,
    setLayout,
    updateLayout,
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    onResizeStart,
    onResize,
    onResizeStop
  })

  // Use the drag hook
  const { dragState, handleDragStart } = useDrag({
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
    containerRef: containerRef as React.RefObject<HTMLDivElement>,
    onDragStart,
    onDrag,
    onDragStop
  })

  // Calculate grid height
  const verticalMargin = margin ? margin[1] : gap
  const heights = layout.map(item => (item.y + item.h) * (rowHeight + verticalMargin))
  const calculatedHeight = heights.length > 0 ? Math.max(...heights) : 0
  
  // Apply autoSize or preserveInitialHeight
  const autoSizeHeight = autoSize ? calculatedHeight + containerPadding[1] * 2 : undefined
  const preservedMinHeight = preserveInitialHeight && initialHeightRef.current !== null
    ? initialHeightRef.current + containerPadding[1] * 2
    : undefined

  // Determine container height style based on options
  // - preserveInitialHeight + autoSize=false: use fixed height for scroll behavior
  // - preserveInitialHeight + autoSize=true: use minHeight (container grows but doesn't shrink)
  // - autoSize only: use minHeight to expand with content
  const containerHeightStyle = (() => {
    if (preserveInitialHeight && !autoSize && preservedMinHeight !== undefined) {
      // Fixed height enables scroll when content exceeds container
      return { height: preservedMinHeight }
    }
    if (autoSizeHeight !== undefined && preservedMinHeight !== undefined) {
      return { minHeight: Math.max(autoSizeHeight, preservedMinHeight) }
    }
    if (autoSizeHeight !== undefined) {
      return { minHeight: autoSizeHeight }
    }
    if (preservedMinHeight !== undefined) {
      return { minHeight: preservedMinHeight }
    }
    return {}
  })()

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
        ...containerHeightStyle,
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
            isColliding={isResizing && resizeState.isColliding}
            isDraggable={isDraggable && item.isDraggable !== false && !item.static}
            isResizable={isResizable && item.isResizable !== false && !item.static}
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
      {droppingItem && isExternalDragging && !dragState.isDragging && (() => {
        const previewX = droppingItem.previewX ?? 0
        const previewY = droppingItem.previewY ?? 0
        const previewW = droppingItem.w || 2
        const previewH = droppingItem.h || 2
        const isValidPosition = droppingItem.isValidPosition ?? true

        // Calculate pixel position using the same logic as grid items
        const previewItem = { x: previewX, y: previewY, w: previewW, h: previewH }
        const position = containerWidth > 0
          ? getPixelPosition(previewItem, cols, rowHeight, gap, containerWidth, margin, containerPadding)
          : { left: containerPadding[0], top: containerPadding[1], width: 0, height: 0 }

        return (
          <div
            className={cn(
              "absolute border-2 border-dashed rounded opacity-75 pointer-events-none flex items-center justify-center transition-all duration-150",
              isValidPosition
                ? "bg-green-200 border-green-400"
                : "bg-red-200 border-red-400"
            )}
            style={{
              width: position.width,
              height: position.height,
              left: position.left,
              top: position.top,
              transform: 'translate3d(0, 0, 0)' // Hardware acceleration
            }}
          >
            <span className={cn(
              "font-medium",
              isValidPosition ? "text-green-600" : "text-red-600"
            )}>
              {isValidPosition ? 'Drop here' : 'Invalid position'}
            </span>
          </div>
        )
      })()}
    </div>
  )
}