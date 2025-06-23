import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Final Line 188 Coverage', () => {
  it('should handle null containerRef in handleDragMove', async () => {
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    const onDrag = vi.fn()
    
    // We need to capture the event handler
    const handlers: EventListener[] = []
    const originalAddEventListener = document.addEventListener
    document.addEventListener = vi.fn((event: string, handler: EventListener) => {
      if (event === 'mousemove') {
        handlers.push(handler)
      }
      originalAddEventListener.call(document, event, handler)
    })
    
    // Render the component
    const { container, unmount } = render(
      <GridContainer items={items} isDraggable={true} onDrag={onDrag}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )
    
    // Start dragging
    const gridItem = container.querySelector('[data-grid-id="1"]')!
    act(() => {
      fireEvent.mouseDown(gridItem, { clientX: 100, clientY: 100 })
    })
    
    // Verify handler was added
    expect(handlers.length).toBeGreaterThan(0)
    
    // Unmount the component - this makes containerRef.current null
    unmount()
    
    // Now call the mousemove handler after unmount
    // This will execute line 188: if (!containerRef.current) return
    act(() => {
      const moveEvent = new MouseEvent('mousemove', { clientX: 200, clientY: 200 })
      handlers.forEach(handler => handler(moveEvent))
    })
    
    // Verify onDrag was not called because of early return
    expect(onDrag).not.toHaveBeenCalled()
    
    // Cleanup
    document.addEventListener = originalAddEventListener
  })
})