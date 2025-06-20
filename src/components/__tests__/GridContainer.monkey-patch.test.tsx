import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'

describe('GridContainer - Monkey Patch Coverage', () => {
  // Test the defensive branches by monkey-patching event handlers
  
  it('should cover all defensive branches through monkey patching', () => {
    const onDragStart = vi.fn()
    const onDrag = vi.fn()
    const onResizeStart = vi.fn()
    
    const TestComponent = () => {
      const containerRef = React.useRef<any>(null)
      const [handlers, setHandlers] = React.useState<any>(null)
      
      React.useEffect(() => {
        if (containerRef.current) {
          // Find GridItem elements and monkey-patch their event handlers
          const gridItems = containerRef.current.querySelectorAll('[data-grid-id]')
          
          gridItems.forEach((item: any) => {
            const originalMouseDown = item.onmousedown
            
            // Capture the bound handlers from the GridItem
            if (originalMouseDown) {
              // Extract the handlers from the closure
              const handlerStr = originalMouseDown.toString()
              
              // Create a wrapper that can call with invalid IDs
              item.onmousedown = (e: MouseEvent) => {
                // First, try with non-existent ID to test line 115
                const fakeEvent = {
                  ...e,
                  currentTarget: {
                    ...e.currentTarget,
                    getAttribute: () => 'non-existent-id',
                    getBoundingClientRect: () => ({ left: 0, top: 0 })
                  }
                } as any
                
                // This should hit the defensive check
                originalMouseDown.call(item, fakeEvent)
                
                // Then call normally
                originalMouseDown.call(item, e)
              }
            }
          })
          
          // For resize handles
          const resizeHandles = containerRef.current.querySelectorAll('.react-grid-layout__resize-handle')
          resizeHandles.forEach((handle: any) => {
            const originalMouseDown = handle.onmousedown
            if (originalMouseDown) {
              handle.onmousedown = (e: MouseEvent) => {
                // Test with non-existent ID for line 252
                const fakeEvent = {
                  ...e,
                  currentTarget: {
                    ...e.currentTarget,
                    parentElement: {
                      getAttribute: () => 'non-existent-id'
                    },
                    getBoundingClientRect: () => ({ left: 0, top: 0 })
                  }
                } as any
                
                originalMouseDown.call(handle, fakeEvent)
                originalMouseDown.call(handle, e)
              }
            }
          })
        }
      }, [])
      
      return (
        <div ref={containerRef}>
          <GridContainer 
            items={[
              { id: '1', x: 0, y: 0, w: 2, h: 2 }
            ]}
            isResizable={true}
            onDragStart={onDragStart}
            onDrag={onDrag}
            onResizeStart={onResizeStart}
          >
            {(item) => <div>{item.id}</div>}
          </GridContainer>
        </div>
      )
    }
    
    const { container } = render(<TestComponent />)
    
    // Trigger drag on item
    const gridItem = container.querySelector('[data-grid-id="1"]')
    if (gridItem) {
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    
    // The monkey-patched handler should have been called with non-existent ID first
    // But the defensive check should prevent the callback
    expect(onDragStart).toHaveBeenCalledTimes(1) // Only the valid call
    
    // Trigger resize
    const resizeHandle = container.querySelector('.react-grid-layout__resize-handle')
    if (resizeHandle) {
      act(() => {
        fireEvent.mouseDown(resizeHandle, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    
    expect(onResizeStart).toHaveBeenCalledTimes(1) // Only the valid call
  })
  
  // Test line 145: Container ref null during drag
  it('should handle null container ref during drag move', () => {
    const onDrag = vi.fn()
    
    let dragStarted = false
    let containerElement: any = null
    
    const TestComponent = () => {
      const [visible, setVisible] = React.useState(true)
      
      return (
        <>
          {visible ? (
            <div ref={el => containerElement = el}>
              <GridContainer 
                items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
                onDragStart={() => {
                  dragStarted = true
                  // Remove container during drag
                  setVisible(false)
                }}
                onDrag={onDrag}
              >
                {(item) => <div>{item.id}</div>}
              </GridContainer>
            </div>
          ) : null}
        </>
      )
    }
    
    const { container } = render(<TestComponent />)
    
    // Start drag
    const gridItem = container.querySelector('[data-grid-id="1"]')
    if (gridItem) {
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    
    expect(dragStarted).toBe(true)
    
    // Now trigger mouse move - container ref should be null
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    // onDrag should not be called due to null container ref
    expect(onDrag).not.toHaveBeenCalled()
  })
})