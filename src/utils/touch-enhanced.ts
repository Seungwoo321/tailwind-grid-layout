export interface Position {
  x: number
  y: number
}

/**
 * Enhanced position getter that supports Mouse, Touch, and Pointer events
 */
export function getControlPositionEnhanced(e: MouseEvent | TouchEvent | PointerEvent): Position | null {
  
  // Handle PointerEvent (includes touch simulation in dev tools)
  if ('pointerId' in e) {
    const pointerEvent = e as PointerEvent
    
    return {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY
    }
  }
  
  // Handle TouchEvent (real mobile devices)
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
  
  // Handle MouseEvent (desktop)
  if ('clientX' in e) {
    return {
      x: e.clientX,
      y: e.clientY
    }
  }
  return null
}

/**
 * Enhanced event options for all pointer types
 */
export const enhancedEventOptions = { passive: false, capture: true }

/**
 * Prevent default behavior for touch and pointer events
 */
export function preventDefaultEnhanced(e: Event): void {
  if (e.cancelable) {
    e.preventDefault()
  }
}