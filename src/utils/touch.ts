export interface Position {
  x: number
  y: number
}

/**
 * Get the position from a mouse or touch event
 */
export function getControlPosition(e: MouseEvent | TouchEvent): Position | null {
  console.log('🔍 getControlPosition called', {
    type: e.type,
    isTouchEvent: 'touches' in e,
    touches: 'touches' in e ? (e as TouchEvent).touches.length : 'N/A',
    changedTouches: 'touches' in e ? (e as TouchEvent).changedTouches.length : 'N/A'
  })
  
  // Handle touch events
  if ('touches' in e) {
    const touchEvent = e as TouchEvent
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0]
    
    console.log('👆 Touch details:', {
      touchesLength: touchEvent.touches.length,
      changedTouchesLength: touchEvent.changedTouches.length,
      touch: touch ? { x: touch.clientX, y: touch.clientY } : null
    })
    
    if (!touch) {
      console.warn('❌ No valid touch found in touch event')
      return null
    }
    
    return {
      x: touch.clientX,
      y: touch.clientY
    }
  }
  
  // Handle mouse events
  console.log('🖱️ Mouse event:', { x: e.clientX, y: e.clientY })
  return {
    x: e.clientX,
    y: e.clientY
  }
}

/**
 * Get touch identifier for tracking specific touches
 */
export function getTouchIdentifier(e: TouchEvent): number | null {
  if (e.targetTouches && e.targetTouches[0]) {
    return e.targetTouches[0].identifier
  }
  if (e.changedTouches && e.changedTouches[0]) {
    return e.changedTouches[0].identifier
  }
  return null
}

/**
 * Check if this is the primary touch (first touch in multi-touch scenario)
 */
export function isPrimaryTouch(e: TouchEvent): boolean {
  return e.touches.length === 1 || 
         (e.touches.length > 1 && e.touches[0]?.identifier === getTouchIdentifier(e))
}

/**
 * Add event listener options for better mobile performance
 */
export const touchEventOptions = { passive: false, capture: true }

/**
 * Prevent default behavior for touch events
 */
export function preventDefaultTouchEvent(e: TouchEvent): void {
  if (e.cancelable) {
    e.preventDefault()
  }
}