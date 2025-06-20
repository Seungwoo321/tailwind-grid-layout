import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, fireEvent } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Touch Edge Cases', () => {
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should handle empty touches during drag move', () => {
    const { container } = render(
      <GridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const gridItem = container.querySelector('[data-grid-id="1"]')!
    
    // Start drag normally
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: [{ clientX: 100, clientY: 100 } as Touch]
    })
    fireEvent(gridItem, touchStartEvent)
    
    // Simulate touch move with empty touches - this should trigger the if (!pos) return branch
    const touchMoveEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: []
    })
    fireEvent(document, touchMoveEvent)
    
    // Should still be dragging but position shouldn't change
    const gridContainer = container.querySelector('.tailwind-grid-layout')!
    expect(gridContainer).toHaveClass('dragging')
  })

  it('should handle empty touches during resize move', () => {
    const { container } = render(
      <GridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const resizeHandle = container.querySelector('.react-grid-layout__resize-handle')!
    
    // Start resize normally
    const touchStartEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: [{ clientX: 100, clientY: 100 } as Touch]
    })
    fireEvent(resizeHandle, touchStartEvent)
    
    // Simulate touch move with empty touches - this should trigger the if (!pos) return branch
    const touchMoveEvent = new TouchEvent('touchmove', {
      bubbles: true,
      cancelable: true,
      touches: []
    })
    fireEvent(document, touchMoveEvent)
    
    // Should still be resizing but size shouldn't change
    const gridContainer = container.querySelector('.tailwind-grid-layout')!
    expect(gridContainer).toHaveClass('resizing')
  })
})