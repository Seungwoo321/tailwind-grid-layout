import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Direct Line 188 Test', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should execute line 188 when containerRef is null during drag', async () => {
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    const onDrag = vi.fn()
    
    let dragHandler: ((e: MouseEvent) => void) | null = null
    
    // Mock addEventListener to capture the drag handler
    const originalAddEventListener = document.addEventListener
    document.addEventListener = vi.fn((event: string, handler: any) => {
      if (event === 'mousemove' && !dragHandler) {
        dragHandler = handler
      }
      return originalAddEventListener.call(document, event, handler)
    })
    
    const { container, rerender } = render(
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
    
    // Verify drag handler was registered
    expect(dragHandler).toBeTruthy()
    
    // Force a re-render with null container by creating a custom component
    const NullRefComponent = () => {
      const [showGrid, setShowGrid] = React.useState(true)
      
      React.useEffect(() => {
        if (showGrid && dragHandler) {
          // Schedule unmount and drag move
          setTimeout(() => {
            setShowGrid(false)
            // Call the drag handler after unmount
            setTimeout(() => {
              if (dragHandler) {
                const moveEvent = new MouseEvent('mousemove', {
                  clientX: 200,
                  clientY: 200,
                  bubbles: true
                })
                dragHandler(moveEvent)
              }
            }, 0)
          }, 0)
        }
      }, [showGrid])
      
      if (!showGrid) return <div>Unmounted</div>
      
      return (
        <GridContainer items={items} isDraggable={true} onDrag={onDrag}>
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )
    }
    
    // Re-render with the wrapper component
    rerender(<NullRefComponent />)
    
    // Wait for async operations
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10))
    })
    
    // Verify onDrag was not called
    expect(onDrag).not.toHaveBeenCalled()
    
    // Cleanup
    document.addEventListener = originalAddEventListener
  })
})