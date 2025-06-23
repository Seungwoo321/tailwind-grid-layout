import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - ContainerRef Null Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should handle null containerRef during drag move to cover line 188', () => {
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    const onDrag = vi.fn()
    
    // Intercept event listeners
    const eventListeners: { [key: string]: EventListener[] } = {
      mousemove: [],
      mouseup: []
    }
    
    const originalAddEventListener = document.addEventListener
    const originalRemoveEventListener = document.removeEventListener
    
    document.addEventListener = vi.fn((event: string, handler: EventListener) => {
      if (event === 'mousemove' || event === 'mouseup') {
        eventListeners[event].push(handler)
      }
      originalAddEventListener.call(document, event, handler)
    })
    
    document.removeEventListener = vi.fn((event: string, handler: EventListener) => {
      if (event === 'mousemove' || event === 'mouseup') {
        const index = eventListeners[event].indexOf(handler)
        if (index > -1) {
          eventListeners[event].splice(index, 1)
        }
      }
      originalRemoveEventListener.call(document, event, handler)
    })
    
    const { container, unmount } = render(
      <GridContainer items={items} isDraggable={true} onDrag={onDrag}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    expect(gridItem).toBeTruthy()

    // Start drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 100, clientY: 100 })
    })
    
    // Verify drag started and mousemove handler is registered
    expect(eventListeners.mousemove.length).toBeGreaterThan(0)
    
    // Unmount the component to make containerRef null
    unmount()
    
    // Now trigger mousemove with the stored handler
    // This should hit line 188: if (!containerRef.current) return
    act(() => {
      const moveHandler = eventListeners.mousemove[0]
      if (moveHandler) {
        const moveEvent = new MouseEvent('mousemove', {
          clientX: 200,
          clientY: 200,
          bubbles: true
        })
        moveHandler(moveEvent)
      }
    })
    
    // Verify onDrag was not called because containerRef was null
    expect(onDrag).not.toHaveBeenCalled()
    
    // Cleanup
    document.addEventListener = originalAddEventListener
    document.removeEventListener = originalRemoveEventListener
  })
})