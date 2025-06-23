import React, { useState, useRef } from 'react'
import { cn } from '../utils/cn'

interface TouchTestGridProps {
  className?: string
}

export const TouchTestGrid: React.FC<TouchTestGridProps> = ({ className }) => {
  const [events, setEvents] = useState<string[]>([])
  const [dragState, setDragState] = useState({ isDragging: false, x: 0, y: 0 })
  const itemRef = useRef<HTMLDivElement>(null)

  const addEvent = (message: string) => {
    setEvents(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const getEventPosition = (e: MouseEvent | TouchEvent | PointerEvent) => {
    // Try PointerEvent first (dev tools touch simulation)
    if ('pointerId' in e) {
      return { x: e.clientX, y: e.clientY, type: 'pointer' }
    }
    // Try TouchEvent (real mobile)
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0, type: 'touch' }
    }
    // Fallback to MouseEvent
    if ('clientX' in e) {
      return { x: e.clientX, y: e.clientY, type: 'mouse' }
    }
    return null
  }

  const handleStart = React.useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    const pos = getEventPosition(e)
    if (!pos) return

    addEvent(`START (${pos.type}): ${e.type} at (${pos.x}, ${pos.y})`)
    setDragState({ isDragging: true, x: pos.x, y: pos.y })
    
    e.preventDefault()
  }, [])

  const handleMove = React.useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    if (!dragState.isDragging) return
    
    const pos = getEventPosition(e)
    if (!pos) return

    addEvent(`MOVE (${pos.type}): ${e.type} to (${pos.x}, ${pos.y})`)
    
    if (itemRef.current) {
      const deltaX = pos.x - dragState.x
      const deltaY = pos.y - dragState.y
      itemRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px)`
    }
    
    e.preventDefault()
  }, [dragState.isDragging, dragState.x, dragState.y])

  const handleEnd = React.useCallback((e: MouseEvent | TouchEvent | PointerEvent) => {
    if (!dragState.isDragging) return
    
    const pos = getEventPosition(e) || { x: 0, y: 0, type: 'unknown' }
    addEvent(`END (${pos.type}): ${e.type}`)
    setDragState({ isDragging: false, x: 0, y: 0 })
    
    if (itemRef.current) {
      itemRef.current.style.transform = 'translate(0px, 0px)'
    }
  }, [dragState.isDragging])

  // Add event listeners for all event types
  React.useEffect(() => {
    const item = itemRef.current
    if (!item) return

    // All possible start events
    const startEvents = ['mousedown', 'touchstart', 'pointerdown']
    const moveEvents = ['mousemove', 'touchmove', 'pointermove']
    const endEvents = ['mouseup', 'touchend', 'pointerup', 'touchcancel', 'pointercancel']

    // Events are automatically detected by the browser

    const handleStartEvent = (e: Event) => handleStart(e as MouseEvent | TouchEvent | PointerEvent)
    const handleDocumentMove = (e: Event) => handleMove(e as MouseEvent | TouchEvent | PointerEvent)
    const handleDocumentEnd = (e: Event) => handleEnd(e as MouseEvent | TouchEvent | PointerEvent)

    startEvents.forEach(event => {
      item.addEventListener(event, handleStartEvent, { passive: false })
    })

    moveEvents.forEach(event => {
      document.addEventListener(event, handleDocumentMove, { passive: false })
    })

    endEvents.forEach(event => {
      document.addEventListener(event, handleDocumentEnd, { passive: false })
    })

    return () => {
      startEvents.forEach(event => {
        item.removeEventListener(event, handleStartEvent)
      })
      moveEvents.forEach(event => {
        document.removeEventListener(event, handleDocumentMove)
      })
      endEvents.forEach(event => {
        document.removeEventListener(event, handleDocumentEnd)
      })
    }
  }, [handleEnd, handleMove, handleStart])

  return (
    <div className={cn('p-6 bg-white rounded-lg shadow-lg', className)}>
      <h3 className="text-lg font-semibold mb-4">터치 이벤트 테스트</h3>
      
      <div
        ref={itemRef}
        className={cn(
          'w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg',
          'flex items-center justify-center text-white font-semibold',
          'cursor-grab select-none transition-transform',
          dragState.isDragging && 'cursor-grabbing scale-105'
        )}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {dragState.isDragging ? '드래그 중' : '터치/드래그'}
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">이벤트 로그:</h4>
        <div className="bg-gray-100 p-3 rounded h-32 overflow-y-auto text-xs font-mono">
          {events.length === 0 ? (
            <div className="text-gray-500">위 박스를 터치하거나 드래그해보세요</div>
          ) : (
            events.map((event, index) => (
              <div key={index} className="py-1 border-b border-gray-200 last:border-0">
                {event}
              </div>
            ))
          )}
        </div>
      </div>

      <button
        onClick={() => setEvents([])}
        className="mt-2 px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
      >
        로그 지우기
      </button>
    </div>
  )
}