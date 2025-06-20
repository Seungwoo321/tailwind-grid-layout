import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'

describe('GridContainer - Unmount During Drag Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle component unmount during active drag (line 144)', () => {
    const onDrag = vi.fn()
    const onDragStop = vi.fn()
    let containerUnmounted = false
    
    const TestWrapper = () => {
      const [showGrid, setShowGrid] = React.useState(true)
      
      React.useEffect(() => {
        // Simulate mouse move after unmount
        if (!showGrid && !containerUnmounted) {
          containerUnmounted = true
          // This mouse move should hit the containerRef.current check
          const moveEvent = new MouseEvent('mousemove', {
            clientX: 200,
            clientY: 200,
            bubbles: true
          })
          document.dispatchEvent(moveEvent)
        }
      }, [showGrid])
      
      return (
        <div>
          {showGrid ? (
            <GridContainer 
              items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
              onDrag={onDrag}
              onDragStop={onDragStop}
              onDragStart={() => {
                // Unmount component right after drag starts
                setTimeout(() => setShowGrid(false), 0)
              }}
            >
              {(item) => <div>{item.id}</div>}
            </GridContainer>
          ) : (
            <div>Grid Unmounted</div>
          )}
        </div>
      )
    }
    
    const { container } = render(<TestWrapper />)
    
    // Start drag
    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()
    
    act(() => {
      fireEvent.mouseDown(gridItem!, { button: 0, clientX: 50, clientY: 50 })
    })
    
    // Run timers to trigger unmount
    act(() => {
      vi.runAllTimers()
    })
    
    // Container should be unmounted
    expect(container.textContent).toContain('Grid Unmounted')
    
    // onDrag should not be called because containerRef.current is null
    expect(onDrag).not.toHaveBeenCalled()
    
    // Clean up
    act(() => {
      fireEvent.mouseUp(document)
    })
  })
})