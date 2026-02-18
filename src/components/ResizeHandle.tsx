'use client'

import React from 'react'
import { cn } from '../utils/cn'

interface ResizeHandleProps {
  position: 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w'
  onMouseDown: (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => void
  isActive?: boolean
  isVisible?: boolean
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  position,
  onMouseDown,
  isActive = true,
  isVisible = true,
}) => {
  // 이벤트 전파를 막아서 부모의 드래그 핸들러가 실행되지 않도록 함
  const handleEvent = (e: React.MouseEvent | React.TouchEvent | React.PointerEvent) => {
    e.stopPropagation()
    onMouseDown(e)
  }
  // Corner handle positions and their styling - with slight offset like React Grid Layout
  const cornerPositions = {
    se: { className: 'bottom-0 right-0', cursor: 'cursor-se-resize', backgroundPosition: 'bottom right', transform: undefined },
    sw: { className: 'bottom-0 left-0', cursor: 'cursor-sw-resize', backgroundPosition: 'bottom left', transform: 'scaleX(-1)' },
    ne: { className: 'top-0 right-0', cursor: 'cursor-ne-resize', backgroundPosition: 'top right', transform: 'scaleY(-1)' },
    nw: { className: 'top-0 left-0', cursor: 'cursor-nw-resize', backgroundPosition: 'top left', transform: 'scale(-1, -1)' }
  }

  // React Grid Layout style handles for corners
  if (cornerPositions[position as keyof typeof cornerPositions] && isVisible) {
    const corner = cornerPositions[position as keyof typeof cornerPositions]
    return (
      <span
        data-testid={`resize-handle-${position}`}
        className={cn(
          'react-grid-layout__resize-handle',
          'absolute w-5 h-5',
          isActive ? corner.cursor : 'cursor-not-allowed opacity-50',
          'z-50',
          'touch-action-none'
        )}
        onMouseDown={isActive ? handleEvent : undefined}
        onTouchStart={isActive ? handleEvent : undefined}
        onDoubleClick={(e) => e.preventDefault()}
        style={{
          ...(position === 'se' && { bottom: '0px', right: '0px', cursor: 'se-resize' }),
          ...(position === 'sw' && { bottom: '0px', left: '0px', cursor: 'sw-resize' }),
          ...(position === 'ne' && { top: '0px', right: '0px', cursor: 'ne-resize' }),
          ...(position === 'nw' && { top: '0px', left: '0px', cursor: 'nw-resize' }),
          backgroundImage: `url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pg08IS0tIEdlbmVyYXRvcjogQWRvYmUgRmlyZXdvcmtzIENTNiwgRXhwb3J0IFNWRyBFeHRlbnNpb24gYnkgQWFyb24gQmVhbGwgKGh0dHA6Ly9maXJld29ya3MuYWJlYWxsLmNvbSkgLiBWZXJzaW9uOiAwLjYuMSAgLS0+DTwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DTxzdmcgaWQ9IlVudGl0bGVkLVBhZ2UlMjAxIiB2aWV3Qm94PSIwIDAgNiA2IiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjojZmZmZmZmMDAiIHZlcnNpb249IjEuMSINCXhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiDQl4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjZweCIgaGVpZ2h0PSI2cHgiDT4NCTxnIG9wYWNpdHk9IjAuMzAyIj4NCQk8cGF0aCBkPSJNIDYgNiBMIDAgNiBMIDAgNC4yIEwgNCA0LjIgTCA0LjIgNC4yIEwgNC4yIDAgTCA2IDAgTCA2IDYgTCA2IDYgWiIgZmlsbD0iIzAwMDAwMCIvPg0JPC9nPg08L3N2Zz4=")`,
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat',
          backgroundOrigin: 'content-box',
          boxSizing: 'border-box',
          transform: corner.transform,
          padding: '3px'
        }}
      />
    )
  }

  // Edge handles (n, s, e, w) - invisible but functional with larger hit area
  const edgeHandleClasses: Record<string, string> = {
    n: 'top-0 left-1/2 -translate-x-1/2 w-16 h-4 cursor-n-resize',
    s: 'bottom-0 left-1/2 -translate-x-1/2 w-16 h-4 cursor-s-resize',
    e: 'right-0 top-1/2 -translate-y-1/2 w-4 h-16 cursor-e-resize',
    w: 'left-0 top-1/2 -translate-y-1/2 w-4 h-16 cursor-w-resize'
  }

  // Cursor styles for edge handles
  const edgeCursors: Record<string, string> = {
    n: 'n-resize',
    s: 's-resize',
    e: 'e-resize',
    w: 'w-resize'
  }

  // Render edge handles (n, s, e, w)
  if (edgeHandleClasses[position]) {
    return (
      <div
        data-testid={`resize-handle-${position}`}
        className={cn(
          'absolute',
          edgeHandleClasses[position],
          !isActive && 'pointer-events-none',
          'z-20',
          'touch-action-none'
        )}
        style={{ cursor: isActive ? edgeCursors[position] : 'not-allowed' }}
        onMouseDown={isActive ? handleEvent : undefined}
        onTouchStart={isActive ? handleEvent : undefined}
        onDoubleClick={(e) => e.preventDefault()}
      />
    )
  }

  // Fallback for any unsupported positions
  return null
}