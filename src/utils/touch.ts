export interface Position {
  x: number
  y: number
}

/**
 * Get the position from a mouse or touch event
 */
export function getControlPosition(e: MouseEvent | TouchEvent | PointerEvent): Position | null {
  // Handle PointerEvent (used by Chrome DevTools touch simulation)
  if ('pointerId' in e) {
    const pointerEvent = e as PointerEvent
    return {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY
    }
  }
  
  // Handle touch events
  if ('touches' in e) {
    const touchEvent = e as TouchEvent
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0]
    
    if (!touch) {
      return null
    }
    
    return {
      x: touch.clientX,
      y: touch.clientY
    }
  }
  
  // Handle mouse events
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
 * passive: false - allows preventDefault to work
 * capture: true - use capturing phase for better touch handling
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