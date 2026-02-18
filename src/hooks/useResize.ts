'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { GridItem, ResizeState } from '../types'
import { getControlPosition, preventDefaultTouchEvent, touchEventOptions } from '../utils/touch'
import { checkCollision } from '../utils/grid'

export interface UseResizeOptions {
  cols: number
  rowHeight: number
  gap: number
  margin?: [number, number]
  containerPadding: [number, number]
  containerWidth: number
  layout: GridItem[]
  setLayout: React.Dispatch<React.SetStateAction<GridItem[]>>
  updateLayout: (layout: GridItem[]) => void
  containerRef: React.RefObject<HTMLDivElement>
  onResizeStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResize?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResizeStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
}

export interface UseResizeReturn {
  resizeState: ResizeState
  handleResizeStart: (
    itemId: string,
    handle: ResizeState['resizeHandle'],
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => void
}

const initialResizeState: ResizeState = {
  isResizing: false,
  resizedItem: null,
  resizeHandle: null,
  startSize: { w: 0, h: 0 },
  startPos: { x: 0, y: 0 },
  currentPixelSize: { w: 0, h: 0 },
  currentPixelPos: { x: 0, y: 0 }
}

export function useResize({
  cols,
  rowHeight,
  gap,
  margin,
  containerPadding,
  containerWidth,
  layout,
  setLayout,
  updateLayout,
  containerRef,
  onResizeStart,
  onResize,
  onResizeStop
}: UseResizeOptions): UseResizeReturn {
  const [resizeState, setResizeState] = useState<ResizeState>(initialResizeState)

  // Use ref to always have latest layout in event handlers
  const layoutRef = useRef(layout)
  layoutRef.current = layout

  // Calculate grid unit dimensions
  const getGridUnits = useCallback(() => {
    const horizontalMargin = margin ? margin[0] : gap
    const verticalMargin = margin ? margin[1] : gap
    const gridWidth = containerWidth - containerPadding[0] * 2
    const colWidth = (gridWidth - horizontalMargin * (cols - 1)) / cols
    const gridUnitW = colWidth + horizontalMargin
    const gridUnitH = rowHeight + verticalMargin
    return { horizontalMargin, verticalMargin, colWidth, gridUnitW, gridUnitH }
  }, [cols, rowHeight, gap, margin, containerPadding, containerWidth])

  // Handle resize start
  const handleResizeStart = useCallback((
    itemId: string,
    handle: ResizeState['resizeHandle'],
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent
  ) => {
    const item = layoutRef.current.find(i => i.id === itemId)!
    const pos = getControlPosition(e.nativeEvent)
    if (!pos) return

    const { horizontalMargin, verticalMargin, colWidth, gridUnitW, gridUnitH } = getGridUnits()

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

    if (onResizeStart) {
      const element = e.currentTarget as HTMLElement
      onResizeStart(layoutRef.current, item, item, { ...item }, e.nativeEvent, element)
    }

    e.preventDefault()
    e.stopPropagation()
    if ('touches' in e.nativeEvent) {
      preventDefaultTouchEvent(e.nativeEvent as TouchEvent)
    }
  }, [getGridUnits, onResizeStart, rowHeight])

  // Handle resize move
  const handleResizeMove = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    const item = layoutRef.current.find(i => i.id === resizeState.resizedItem)
    if (!item) return

    const pos = getControlPosition(e)
    if (!pos) return

    const { horizontalMargin, verticalMargin, colWidth, gridUnitW, gridUnitH } = getGridUnits()

    const pixelDeltaX = pos.x - resizeState.startPos.x
    const pixelDeltaY = pos.y - resizeState.startPos.y

    const gridDeltaX = pixelDeltaX / gridUnitW
    const gridDeltaY = pixelDeltaY / gridUnitH

    let newGridW = resizeState.startSize.w
    let newGridH = resizeState.startSize.h
    let newGridX = resizeState.originalPos?.x ?? item.x
    let newGridY = resizeState.originalPos?.y ?? item.y

    // Calculate new size/position based on handle
    switch (resizeState.resizeHandle) {
      case 'se': {
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'sw': {
        const deltaW = Math.round(gridDeltaX)
        const maxDeltaW = resizeState.startSize.w - 1
        const clampedDeltaW = Math.min(deltaW, maxDeltaW)
        newGridX = Math.max(0, (resizeState.originalPos?.x ?? item.x) + clampedDeltaW)
        newGridW = Math.max(1, resizeState.startSize.w - clampedDeltaW)
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'ne': {
        const deltaH = Math.round(gridDeltaY)
        const maxDeltaH = resizeState.startSize.h - 1
        const clampedDeltaH = Math.min(deltaH, maxDeltaH)
        newGridY = Math.max(0, (resizeState.originalPos?.y ?? item.y) + clampedDeltaH)
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        newGridH = Math.max(1, resizeState.startSize.h - clampedDeltaH)
        break
      }
      case 'nw': {
        const deltaW = Math.round(gridDeltaX)
        const deltaH = Math.round(gridDeltaY)
        const maxDeltaW = resizeState.startSize.w - 1
        const maxDeltaH = resizeState.startSize.h - 1
        const clampedDeltaW = Math.min(deltaW, maxDeltaW)
        const clampedDeltaH = Math.min(deltaH, maxDeltaH)
        newGridX = Math.max(0, (resizeState.originalPos?.x ?? item.x) + clampedDeltaW)
        newGridY = Math.max(0, (resizeState.originalPos?.y ?? item.y) + clampedDeltaH)
        newGridW = Math.max(1, resizeState.startSize.w - clampedDeltaW)
        newGridH = Math.max(1, resizeState.startSize.h - clampedDeltaH)
        break
      }
      case 'e': {
        newGridW = Math.max(1, Math.round(resizeState.startSize.w + gridDeltaX))
        break
      }
      case 'w': {
        const deltaW = Math.round(gridDeltaX)
        const maxDeltaW = resizeState.startSize.w - 1
        const clampedDeltaW = Math.min(deltaW, maxDeltaW)
        newGridX = Math.max(0, (resizeState.originalPos?.x ?? item.x) + clampedDeltaW)
        newGridW = Math.max(1, resizeState.startSize.w - clampedDeltaW)
        break
      }
      case 's': {
        newGridH = Math.max(1, Math.round(resizeState.startSize.h + gridDeltaY))
        break
      }
      case 'n': {
        const deltaH = Math.round(gridDeltaY)
        const maxDeltaH = resizeState.startSize.h - 1
        const clampedDeltaH = Math.min(deltaH, maxDeltaH)
        newGridY = Math.max(0, (resizeState.originalPos?.y ?? item.y) + clampedDeltaH)
        newGridH = Math.max(1, resizeState.startSize.h - clampedDeltaH)
        break
      }
    }

    // Apply boundary constraints
    newGridX = Math.max(0, Math.min(cols - newGridW, newGridX))
    newGridW = Math.min(newGridW, cols - newGridX)

    // Apply minW/maxW constraints
    const constrainedW = Math.min(Math.max(item.minW || 1, newGridW), item.maxW || Infinity)
    const constrainedH = Math.max(item.minH || 1, Math.min(newGridH, item.maxH || Infinity))
    const constrainedX = Math.max(0, Math.min(cols - constrainedW, newGridX))
    const constrainedY = Math.max(0, newGridY)

    // Static item collision detection
    const staticItems = layoutRef.current.filter(i => i.static && i.id !== item.id)
    let finalX = constrainedX
    let finalY = constrainedY
    let finalW = constrainedW
    let finalH = constrainedH
    let hasCollision = false

    for (const staticItem of staticItems) {
      const tempItem = { ...item, x: constrainedX, y: constrainedY, w: constrainedW, h: constrainedH }

      if (checkCollision(tempItem, staticItem)) {
        hasCollision = true

        switch (resizeState.resizeHandle) {
          case 'se':
            if (tempItem.x < staticItem.x) {
              finalW = Math.min(finalW, staticItem.x - tempItem.x)
            }
            if (tempItem.y < staticItem.y) {
              finalH = Math.min(finalH, staticItem.y - tempItem.y)
            }
            break

          case 'nw':
            if (staticItem.x + staticItem.w <= resizeState.originalPos!.x + resizeState.startSize.w) {
              const maxLeftMove = resizeState.originalPos!.x - (staticItem.x + staticItem.w)
              const actualLeftMove = resizeState.originalPos!.x - constrainedX
              if (actualLeftMove > maxLeftMove) {
                finalX = staticItem.x + staticItem.w
                finalW = resizeState.originalPos!.x + resizeState.startSize.w - finalX
              }
            }
            if (staticItem.y + staticItem.h <= resizeState.originalPos!.y + resizeState.startSize.h) {
              const maxUpMove = resizeState.originalPos!.y - (staticItem.y + staticItem.h)
              const actualUpMove = resizeState.originalPos!.y - constrainedY
              if (actualUpMove > maxUpMove) {
                finalY = staticItem.y + staticItem.h
                finalH = resizeState.originalPos!.y + resizeState.startSize.h - finalY
              }
            }
            break

          case 'sw':
            if (staticItem.x + staticItem.w <= resizeState.originalPos!.x + resizeState.startSize.w) {
              const maxLeftMove = resizeState.originalPos!.x - (staticItem.x + staticItem.w)
              const actualLeftMove = resizeState.originalPos!.x - constrainedX
              if (actualLeftMove > maxLeftMove) {
                finalX = staticItem.x + staticItem.w
                finalW = resizeState.originalPos!.x + resizeState.startSize.w - finalX
              }
            }
            if (tempItem.y < staticItem.y) {
              finalH = Math.min(finalH, staticItem.y - tempItem.y)
            }
            break

          case 'ne':
            if (tempItem.x < staticItem.x) {
              finalW = Math.min(finalW, staticItem.x - tempItem.x)
            }
            if (staticItem.y + staticItem.h <= resizeState.originalPos!.y + resizeState.startSize.h) {
              const maxUpMove = resizeState.originalPos!.y - (staticItem.y + staticItem.h)
              const actualUpMove = resizeState.originalPos!.y - constrainedY
              if (actualUpMove > maxUpMove) {
                finalY = staticItem.y + staticItem.h
                finalH = resizeState.originalPos!.y + resizeState.startSize.h - finalY
              }
            }
            break

          case 'w':
            if (staticItem.x + staticItem.w <= resizeState.originalPos!.x + resizeState.startSize.w) {
              const maxLeftMove = resizeState.originalPos!.x - (staticItem.x + staticItem.w)
              const actualLeftMove = resizeState.originalPos!.x - constrainedX
              if (actualLeftMove > maxLeftMove) {
                finalX = staticItem.x + staticItem.w
                finalW = resizeState.originalPos!.x + resizeState.startSize.w - finalX
              }
            }
            break

          case 'e':
            if (tempItem.x < staticItem.x) {
              finalW = Math.min(finalW, staticItem.x - tempItem.x)
            }
            break

          case 'n':
            if (staticItem.y + staticItem.h <= resizeState.originalPos!.y + resizeState.startSize.h) {
              const maxUpMove = resizeState.originalPos!.y - (staticItem.y + staticItem.h)
              const actualUpMove = resizeState.originalPos!.y - constrainedY
              if (actualUpMove > maxUpMove) {
                finalY = staticItem.y + staticItem.h
                finalH = resizeState.originalPos!.y + resizeState.startSize.h - finalY
              }
            }
            break

          case 's':
            if (tempItem.y < staticItem.y) {
              finalH = Math.min(finalH, staticItem.y - tempItem.y)
            }
            break
        }
      }
    }

    // Update collision state
    setResizeState(prev => ({
      ...prev,
      isColliding: hasCollision
    }))

    const newLayout = layoutRef.current.map(i =>
      i.id === resizeState.resizedItem
        ? { ...i, x: finalX, y: finalY, w: finalW, h: finalH }
        : i
    )

    setLayout(newLayout)

    // Calculate final pixel positions
    const finalPixelX = finalX * gridUnitW
    const finalPixelY = finalY * gridUnitH
    const finalPixelW = finalW * colWidth + (finalW - 1) * horizontalMargin
    const finalPixelH = finalH * rowHeight + (finalH - 1) * verticalMargin

    setResizeState(prev => ({
      ...prev,
      currentPixelSize: { w: finalPixelW, h: finalPixelH },
      currentPixelPos: { x: finalPixelX, y: finalPixelY }
    }))

    // Call onResize callback
    if (onResize && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`) as HTMLElement
      if (element) {
        const originalItem = { ...item, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h }
        const newItem = { ...item, x: finalX, y: finalY, w: finalW, h: finalH }
        onResize(newLayout, originalItem, newItem, newItem, e, element)
      }
    }

    if ('touches' in e) {
      e.preventDefault()
    }
  }, [resizeState, cols, rowHeight, getGridUnits, setLayout, onResize, containerRef])

  // Handle resize end
  const handleResizeEnd = useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    const resizedItem = layoutRef.current.find(i => i.id === resizeState.resizedItem)
    if (resizedItem && onResizeStop && resizeState.originalPos) {
      const element = containerRef.current?.querySelector(`[data-grid-id="${resizeState.resizedItem}"]`) as HTMLElement
      if (element) {
        const originalItem = { ...resizedItem, x: resizeState.originalPos.x, y: resizeState.originalPos.y, w: resizeState.startSize.w, h: resizeState.startSize.h }
        onResizeStop(layoutRef.current, originalItem, resizedItem, resizedItem, e, element)
      }
    }

    updateLayout(layoutRef.current)

    setResizeState(initialResizeState)
  }, [resizeState, updateLayout, onResizeStop, containerRef])

  // Set up event listeners
  useEffect(() => {
    if (resizeState.isResizing) {
      document.addEventListener('mousemove', handleResizeMove)
      document.addEventListener('mouseup', handleResizeEnd)
      document.addEventListener('touchmove', handleResizeMove, touchEventOptions)
      document.addEventListener('touchend', handleResizeEnd, touchEventOptions)
      document.addEventListener('touchcancel', handleResizeEnd, touchEventOptions)
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
    return undefined
  }, [resizeState.isResizing, handleResizeMove, handleResizeEnd])

  return {
    resizeState,
    handleResizeStart
  }
}
