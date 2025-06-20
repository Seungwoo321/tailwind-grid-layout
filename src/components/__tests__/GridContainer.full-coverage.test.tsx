import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Full 100% Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Cover line 112: if (!isDraggable) return
  it('should handle drag operations with isDraggable=false', () => {
    const onDragStart = vi.fn()
    const onDrag = vi.fn()
    const onDragStop = vi.fn()

    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isDraggable={false}
        onDragStart={onDragStart}
        onDrag={onDrag}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // GridItem won't render as draggable, so no drag will start
    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()
    
    // Try to drag - it should not work
    if (gridItem) {
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
      })
      act(() => {
        fireEvent.mouseUp(document)
      })
    }

    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDrag).not.toHaveBeenCalled()
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Cover line 115: if (!item || item.isDraggable === false) return
  it('should handle item with isDraggable=false', () => {
    const onDragStart = vi.fn()

    const { container } = render(
      <GridContainer 
        items={[
          { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false },
          { id: '2', x: 2, y: 0, w: 2, h: 2 }
        ]}
        isDraggable={true}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Try to drag non-draggable item
    const gridItem1 = container.querySelector('[data-grid-id="1"]')
    if (gridItem1) {
      act(() => {
        fireEvent.mouseDown(gridItem1, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).not.toHaveBeenCalled()

    // Draggable item should work
    const gridItem2 = container.querySelector('[data-grid-id="2"]')
    if (gridItem2) {
      act(() => {
        fireEvent.mouseDown(gridItem2, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).toHaveBeenCalledTimes(1)
  })

  // Cover lines 144, 221, 276, 377: Event handlers without active state
  it('should handle all mouse events without active drag/resize state', () => {
    const callbacks = {
      onDrag: vi.fn(),
      onDragStop: vi.fn(),
      onResize: vi.fn(),
      onResizeStop: vi.fn()
    }

    render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        {...callbacks}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Trigger events without starting drag/resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100
    })
      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    Object.values(callbacks).forEach(cb => {
      expect(cb).not.toHaveBeenCalled()
    })
  })

  // Cover line 195: originalPosition fallback & line 227: placeholder fallback
  it('should handle drag with fallback values', () => {
    const onDrag = vi.fn()
    const onDragStop = vi.fn()

    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        preventCollision={false}
        allowOverlap={false}
        onDrag={onDrag}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    const gridItem = container.querySelector('[data-grid-id="1"]')
    
    if (gridItem) {
      // Start drag
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
      
      act(() => {
        // Move (originalPosition should be set, but code has fallback)
        act(() => {
          fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
        })
        
        // Stop drag (placeholder should be set, but code has fallback)
        act(() => {
          fireEvent.mouseUp(document)
        })
      })
    }

    expect(onDragStop).toHaveBeenCalled()
  })

  // Cover lines 250, 253: Resize disabled checks
  it('should not render resize handles when disabled', () => {
    const onResizeStart = vi.fn()

    // Container level disabled
    const { container: container1 } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isResizable={false}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    expect(container1.querySelectorAll('[class*="cursor-"][class*="resize"]').length).toBe(0)

    // Item level disabled
    const { container: container2 } = render(
      <GridContainer 
        items={[{ id: '2', x: 0, y: 0, w: 2, h: 2, isResizable: false }]}
        isResizable={true}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    expect(container2.querySelectorAll('[class*="cursor-"][class*="resize"]').length).toBe(0)
  })

  // Test edge case: Start drag and remove container
  it('should handle container removal during drag', async () => {
    const onDragStop = vi.fn()
    
    const TestComponent = () => {
      const [mounted, setMounted] = React.useState(true)
      const triggerRef = React.useRef<() => void>()

      // Expose a function to trigger drag and unmount
      React.useEffect(() => {
        triggerRef.current = () => {
          const gridItem = document.querySelector('[data-grid-id="1"]')
          if (gridItem) {
            // Start drag
            fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
            
            // Unmount component while dragging
            setMounted(false)
          }
        }
      }, [])

      return (
        <>
          <button onClick={() => triggerRef.current?.()}>Trigger</button>
          {mounted && (
            <GridContainer 
              items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
              onDragStop={onDragStop}
            >
              {(item) => <div>{item.id}</div>}
            </GridContainer>
          )}
        </>
      )
    }

    const { getByText } = render(<TestComponent />)
    
    // Trigger drag and unmount
    await act(async () => {
      fireEvent.click(getByText('Trigger'))
    })
    
    // Try to end drag after component unmounted
    await act(async () => {
      fireEvent.mouseUp(document)
    })

    // Callback might not be called if component is unmounted
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Additional defensive programming test
  it('should handle all defensive branches comprehensively', () => {
    const { container } = render(
      <GridContainer 
        items={[
          { id: '1', x: 0, y: 0, w: 2, h: 2, static: true },
          { id: '2', x: 2, y: 0, w: 2, h: 2, isDraggable: false },
          { id: '3', x: 4, y: 0, w: 2, h: 2, isResizable: false },
          { id: '4', x: 0, y: 2, w: 2, h: 2 }
        ]}
        isDraggable={true}
        isResizable={true}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Static items can't be dragged
    const staticItem = container.querySelector('[data-grid-id="1"]')
    if (staticItem) {
      act(() => {
        fireEvent.mouseDown(staticItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }

    // Non-draggable items
    const nonDraggableItem = container.querySelector('[data-grid-id="2"]')
    if (nonDraggableItem) {
      act(() => {
        fireEvent.mouseDown(nonDraggableItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }

    // Non-resizable items won't have resize handles - check the grid item itself
    const itemContainer = container.querySelector('[data-grid-id="3"]')
    const resizeHandles = itemContainer?.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles?.length || 0).toBe(0)

    // Normal item should work
    const normalItem = container.querySelector('[data-grid-id="4"]')
    if (normalItem) {
      act(() => {
        fireEvent.mouseDown(normalItem, { button: 0, clientX: 0, clientY: 0 })
      })
      act(() => {
        fireEvent.mouseMove(document, { clientX: 50, clientY: 50 })
      })
      act(() => {
        fireEvent.mouseUp(document)
      })
    }
  })
})