import { describe, it, expect, vi } from 'vitest'
import { 
  getControlPosition, 
  getTouchIdentifier, 
  isPrimaryTouch, 
  preventDefaultTouchEvent,
  touchEventOptions 
} from '../touch'

describe('touch utilities', () => {
  describe('getControlPosition', () => {
    it('should get position from mouse event', () => {
      const mouseEvent = new MouseEvent('mousedown', {
        clientX: 100,
        clientY: 200
      })
      
      const position = getControlPosition(mouseEvent)
      expect(position).toEqual({ x: 100, y: 200 })
    })

    it('should get position from touch event with touches', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ clientX: 150, clientY: 250 } as Touch]
      })
      
      const position = getControlPosition(touchEvent)
      expect(position).toEqual({ x: 150, y: 250 })
    })

    it('should get position from touch event with changedTouches when no touches', () => {
      const touchEvent = new TouchEvent('touchend', {
        changedTouches: [{ clientX: 300, clientY: 400 } as Touch]
      })
      
      const position = getControlPosition(touchEvent)
      expect(position).toEqual({ x: 300, y: 400 })
    })

    it('should return null when no valid touch is found', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: []
      })
      
      const position = getControlPosition(touchEvent)
      expect(position).toBeNull()
    })

    it('should get position from pointer event', () => {
      const pointerEvent = {
        type: 'pointerdown',
        pointerId: 1,
        clientX: 500,
        clientY: 600
      } as PointerEvent
      
      const position = getControlPosition(pointerEvent)
      expect(position).toEqual({ x: 500, y: 600 })
    })
  })

  describe('getTouchIdentifier', () => {
    it('should get identifier from targetTouches', () => {
      const touchEvent = new TouchEvent('touchmove', {
        targetTouches: [{ identifier: 1 } as Touch],
        changedTouches: [{ identifier: 2 } as Touch]
      })
      
      const identifier = getTouchIdentifier(touchEvent)
      expect(identifier).toBe(1)
    })

    it('should get identifier from changedTouches when no targetTouches', () => {
      const touchEvent = new TouchEvent('touchend', {
        changedTouches: [{ identifier: 3 } as Touch]
      })
      
      const identifier = getTouchIdentifier(touchEvent)
      expect(identifier).toBe(3)
    })

    it('should return null when no touches available', () => {
      const touchEvent = new TouchEvent('touchcancel')
      
      const identifier = getTouchIdentifier(touchEvent)
      expect(identifier).toBeNull()
    })
  })

  describe('isPrimaryTouch', () => {
    it('should return true for single touch', () => {
      const touchEvent = new TouchEvent('touchstart', {
        touches: [{ identifier: 1 } as Touch]
      })
      
      const isPrimary = isPrimaryTouch(touchEvent)
      expect(isPrimary).toBe(true)
    })

    it('should return true for primary touch in multi-touch', () => {
      const touchEvent = new TouchEvent('touchmove', {
        touches: [
          { identifier: 1 } as Touch,
          { identifier: 2 } as Touch
        ],
        targetTouches: [{ identifier: 1 } as Touch]
      })
      
      const isPrimary = isPrimaryTouch(touchEvent)
      expect(isPrimary).toBe(true)
    })

    it('should return false for non-primary touch in multi-touch', () => {
      const touchEvent = new TouchEvent('touchmove', {
        touches: [
          { identifier: 1 } as Touch,
          { identifier: 2 } as Touch
        ],
        targetTouches: [{ identifier: 2 } as Touch]
      })
      
      const isPrimary = isPrimaryTouch(touchEvent)
      expect(isPrimary).toBe(false)
    })
  })

  describe('preventDefaultTouchEvent', () => {
    it('should prevent default when event is cancelable', () => {
      const touchEvent = new TouchEvent('touchmove', {
        cancelable: true
      })
      const preventDefault = vi.spyOn(touchEvent, 'preventDefault')
      
      preventDefaultTouchEvent(touchEvent)
      
      expect(preventDefault).toHaveBeenCalled()
    })

    it('should not prevent default when event is not cancelable', () => {
      const touchEvent = new TouchEvent('touchmove', {
        cancelable: false
      })
      const preventDefault = vi.spyOn(touchEvent, 'preventDefault')
      
      preventDefaultTouchEvent(touchEvent)
      
      expect(preventDefault).not.toHaveBeenCalled()
    })
  })

  describe('touchEventOptions', () => {
    it('should have correct options for better mobile performance', () => {
      expect(touchEventOptions).toEqual({
        passive: false,
        capture: true
      })
    })
  })
})