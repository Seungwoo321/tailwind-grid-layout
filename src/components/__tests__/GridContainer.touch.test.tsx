import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Touch Support', () => {
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

  const mockOnLayoutChange = vi.fn()
  const mockOnDragStart = vi.fn()
  const mockOnDragStop = vi.fn()
  const mockOnResizeStart = vi.fn()
  const mockOnResizeStop = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Touch Drag Events', () => {
    it('should handle touch drag events', () => {
      const { container } = render(
        <GridContainer
          items={defaultItems}
          onLayoutChange={mockOnLayoutChange}
          onDragStart={mockOnDragStart}
          onDragStop={mockOnDragStop}
        >
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      // Simulate touch start
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      fireEvent(gridItem, touchStartEvent)
      
      expect(mockOnDragStart).toHaveBeenCalled()

      // Simulate touch move
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 150, clientY: 150 } as Touch]
      })
      fireEvent(document, touchMoveEvent)

      // Simulate touch end
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [{ clientX: 150, clientY: 150 } as Touch]
      })
      fireEvent(document, touchEndEvent)

      expect(mockOnDragStop).toHaveBeenCalled()
    })

    it('should prevent default touch behavior during drag', () => {
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      
      const preventDefault = vi.spyOn(touchStartEvent, 'preventDefault')
      fireEvent(gridItem, touchStartEvent)
      
      expect(preventDefault).toHaveBeenCalled()
    })
  })

  describe('Touch Resize Events', () => {
    it('should handle touch resize events', () => {
      const { container } = render(
        <GridContainer
          items={defaultItems}
          onResizeStart={mockOnResizeStart}
          onResizeStop={mockOnResizeStop}
        >
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const resizeHandle = container.querySelector('.react-grid-layout__resize-handle')!
      
      // Simulate touch start on resize handle
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      fireEvent(resizeHandle, touchStartEvent)
      
      expect(mockOnResizeStart).toHaveBeenCalled()

      // Simulate touch move
      const touchMoveEvent = new TouchEvent('touchmove', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 120, clientY: 120 } as Touch]
      })
      fireEvent(document, touchMoveEvent)

      // Simulate touch end
      const touchEndEvent = new TouchEvent('touchend', {
        bubbles: true,
        cancelable: true,
        changedTouches: [{ clientX: 120, clientY: 120 } as Touch]
      })
      fireEvent(document, touchEndEvent)

      expect(mockOnResizeStop).toHaveBeenCalled()
    })
  })

  describe('Multi-touch Handling', () => {
    it('should handle only the first touch in multi-touch scenarios', () => {
      const { container } = render(
        <GridContainer
          items={defaultItems}
          onDragStart={mockOnDragStart}
        >
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      // Simulate multi-touch start
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [
          { clientX: 100, clientY: 100, identifier: 1 } as Touch,
          { clientX: 200, clientY: 200, identifier: 2 } as Touch
        ]
      })
      fireEvent(gridItem, touchStartEvent)
      
      expect(mockOnDragStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('CSS Classes', () => {
    it('should add dragging class during touch drag', () => {
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridContainer = container.querySelector('.tailwind-grid-layout')!
      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      // Start drag
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      fireEvent(gridItem, touchStartEvent)
      
      expect(gridContainer).toHaveClass('dragging')
    })

    it('should add resizing class during touch resize', () => {
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridContainer = container.querySelector('.tailwind-grid-layout')!
      const resizeHandle = container.querySelector('.react-grid-layout__resize-handle')!
      
      // Start resize
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      fireEvent(resizeHandle, touchStartEvent)
      
      expect(gridContainer).toHaveClass('resizing')
    })
  })

  describe('Touch Event Options', () => {
    it('should register touch event listeners with passive: false', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')
      
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      // Start drag to trigger event listener registration
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: [{ clientX: 100, clientY: 100 } as Touch]
      })
      fireEvent(gridItem, touchStartEvent)
      
      // Check that touch event listeners were added with correct options
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        { passive: false, capture: true }
      )
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
        { passive: false, capture: true }
      )
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty touch events during drag start', () => {
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const gridItem = container.querySelector('[data-grid-id="1"]')!
      
      // Create touch event with empty touches
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: []
      })
      fireEvent(gridItem, touchStartEvent)
      
      // Should not crash and should not start dragging
      const gridContainer = container.querySelector('.tailwind-grid-layout')!
      expect(gridContainer).not.toHaveClass('dragging')
    })

    it('should handle empty touch events during resize start', () => {
      const { container } = render(
        <GridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )

      const resizeHandle = container.querySelector('.react-grid-layout__resize-handle')!
      
      // Create touch event with empty touches
      const touchStartEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
        touches: []
      })
      fireEvent(resizeHandle, touchStartEvent)
      
      // Should not crash and should not start resizing
      const gridContainer = container.querySelector('.tailwind-grid-layout')!
      expect(gridContainer).not.toHaveClass('resizing')
    })
  })
})