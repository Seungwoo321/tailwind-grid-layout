// Touch event debugging utilities

export function logTouchEvent(eventName: string, e: TouchEvent | MouseEvent) {
  // Production build: logging disabled
  if (process.env.NODE_ENV === 'development') {
    if ('touches' in e) {
      console.log(`🔥 TOUCH EVENT: ${eventName}`, {
        type: e.type,
        touches: e.touches.length,
        targetTouches: e.targetTouches?.length || 0,
        changedTouches: e.changedTouches?.length || 0,
        target: (e.target as Element)?.tagName,
        timestamp: Date.now()
      })
    } else {
      console.log(`🖱️ MOUSE EVENT: ${eventName}`, {
        type: e.type,
        target: (e.target as Element)?.tagName,
        timestamp: Date.now()
      })
    }
  }
}

export function enableTouchDebugging() {
  // Add global event listeners to debug touch events
  document.addEventListener('touchstart', (e) => logTouchEvent('touchstart', e), { passive: false })
  document.addEventListener('touchmove', (e) => logTouchEvent('touchmove', e), { passive: false })
  document.addEventListener('touchend', (e) => logTouchEvent('touchend', e), { passive: false })
  
  // Also log mouse events for comparison
  document.addEventListener('mousedown', (e) => logTouchEvent('mousedown', e))
  document.addEventListener('mousemove', (e) => logTouchEvent('mousemove', e))
  document.addEventListener('mouseup', (e) => logTouchEvent('mouseup', e))
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 Touch debugging enabled')
  }
}