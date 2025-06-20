import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import { createRoot } from 'react-dom/client'

describe('GridContainer - Force Line 144 Coverage', () => {
  it('should hit containerRef null check during drag', () => {
    const onDrag = vi.fn()
    let mouseMoveHandler: ((e: MouseEvent) => void) | null = null
    
    // Mock addEventListener to capture the mousemove handler
    const originalAddEventListener = document.addEventListener
    document.addEventListener = vi.fn((event: string, handler: any) => {
      if (event === 'mousemove' && !mouseMoveHandler) {
        mouseMoveHandler = handler
      }
      originalAddEventListener.call(document, event, handler)
    })
    
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    const TestComponent = () => {
      return (
        <GridContainer 
          items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
          onDrag={onDrag}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    // Render component
    const root = createRoot(container)
    act(() => {
      root.render(<TestComponent />)
    })
    
    // Start drag
    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()
    
    act(() => {
      fireEvent.mouseDown(gridItem!, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Verify mousemove handler was added
    expect(mouseMoveHandler).toBeTruthy()
    
    // Unmount component while drag is active
    act(() => {
      root.unmount()
    })
    
    // Now call the mousemove handler directly - containerRef should be null
    if (mouseMoveHandler) {
      const moveEvent = new MouseEvent('mousemove', {
        clientX: 100,
        clientY: 100,
        bubbles: true
      })
      
      act(() => {
        mouseMoveHandler!(moveEvent)
      })
    }
    
    // onDrag should not be called due to null containerRef
    expect(onDrag).not.toHaveBeenCalled()
    
    // Cleanup
    document.body.removeChild(container)
    document.addEventListener = originalAddEventListener
    
    // Fire mouseup to clean up
    act(() => {
      fireEvent.mouseUp(document)
    })
  })
})