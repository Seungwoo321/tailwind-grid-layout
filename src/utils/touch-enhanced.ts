export interface Position {
  x: number
  y: number
}

/**
 * Enhanced position getter that supports Mouse, Touch, and Pointer events
 */
export function getControlPositionEnhanced(e: MouseEvent | TouchEvent | PointerEvent): Position | null {
  console.log('🔍 getControlPositionEnhanced called', {
    type: e.type,
    constructor: e.constructor.name,
    isTouchEvent: 'touches' in e,
    isPointerEvent: 'pointerId' in e,
    hasClientX: 'clientX' in e
  })
  
  // Handle PointerEvent (includes touch simulation in dev tools)
  if ('pointerId' in e) {
    const pointerEvent = e as PointerEvent
    console.log('📱 PointerEvent detected:', {
      pointerId: pointerEvent.pointerId,
      pointerType: pointerEvent.pointerType, // "mouse", "pen", "touch"
      isPrimary: pointerEvent.isPrimary,
      x: pointerEvent.clientX,
      y: pointerEvent.clientY
    })
    
    return {
      x: pointerEvent.clientX,
      y: pointerEvent.clientY
    }
  }
  
  // Handle TouchEvent (real mobile devices)
  if ('touches' in e) {
    const touchEvent = e as TouchEvent
    const touch = touchEvent.touches[0] || touchEvent.changedTouches[0]
    
    console.log('👆 TouchEvent detected:', {
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
  
  // Handle MouseEvent (desktop)
  if ('clientX' in e) {
    console.log('🖱️ MouseEvent detected:', { x: e.clientX, y: e.clientY })
    return {
      x: e.clientX,
      y: e.clientY
    }
  }
  
  console.error('❌ Unknown event type:', e)
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