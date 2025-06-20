import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'

describe('GridContainer - Line 144 Coverage', () => {
  it('should handle null containerRef during drag move', () => {
    const onDrag = vi.fn()
    const onDragStart = vi.fn()
    let dragStarted = false
    
    // We need to simulate a scenario where:
    // 1. Drag starts (setting up mouse move listener)
    // 2. Container unmounts (containerRef becomes null)
    // 3. Mouse move event fires (hitting line 144)
    
    const TestComponent = () => {
      const [visible, setVisible] = React.useState(true)
      const containerRef = React.useRef<HTMLDivElement>(null)
      
      React.useEffect(() => {
        if (dragStarted && visible) {
          // Unmount immediately after drag starts
          setVisible(false)
        }
      }, [dragStarted, visible])
      
      React.useEffect(() => {
        if (dragStarted && !visible) {
          // Fire mouse move after container is gone
          const moveEvent = new MouseEvent('mousemove', {
            clientX: 100,
            clientY: 100,
            bubbles: true
          })
          document.dispatchEvent(moveEvent)
        }
      }, [dragStarted, visible])
      
      return (
        <div ref={containerRef}>
          {visible && (
            <GridContainer 
              items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
              onDrag={onDrag}
              onDragStart={(...args) => {
                dragStarted = true
                onDragStart(...args)
              }}
            >
              {(item) => <div>{item.id}</div>}
            </GridContainer>
          )}
        </div>
      )
    }
    
    const { container } = render(<TestComponent />)
    
    // Find and start dragging
    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()
    
    // Start drag - this will trigger the unmount and mouse move
    act(() => {
      fireEvent.mouseDown(gridItem!, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Drag started
    expect(onDragStart).toHaveBeenCalled()
    
    // But onDrag should not be called because containerRef is null
    expect(onDrag).not.toHaveBeenCalled()
    
    // Clean up
    act(() => {
      fireEvent.mouseUp(document)
    })
  })
})