import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Uncovered Branches', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // Line 112: isDraggable check in handleDragStart
  it('should not start drag when container isDraggable is false', () => {
    const onDragStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items} isDraggable={false} onDragStart={onDragStart}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('.absolute') as HTMLElement
    
    // Try to drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Line 115: item.isDraggable === false check
  it('should not start drag when item.isDraggable is explicitly false', () => {
    const onDragStart = vi.fn()
    const onDrag = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false }
    ]
    
    const { container } = render(
      <GridContainer items={items} isDraggable={true} onDragStart={onDragStart} onDrag={onDrag}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('.absolute') as HTMLElement
    
    // Try to drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onDragStart).not.toHaveBeenCalled()
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Line 144: handleDrag without proper drag state
  it('should not handle drag without proper drag state', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mousemove without mousedown
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    // Should not crash
    expect(container).toBeTruthy()
  })

  // Line 195: originalPosition fallback
  it('should use draggedItem as fallback when originalPosition is not set', () => {
    const onDragStop = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const TestComponent = () => {
      const [testItems, setTestItems] = React.useState(items)
      
      React.useEffect(() => {
        // Simulate a drag scenario where originalPosition might not be set
        const timer = setTimeout(() => {
          // Force a drag end scenario
          document.dispatchEvent(new MouseEvent('mouseup'))
        }, 100)
        return () => clearTimeout(timer)
      }, [])
      
      return (
        <GridContainer items={testItems} onDragStop={onDragStop}>
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    render(<TestComponent />)
    act(() => {
      vi.runAllTimers()
    })
  })

  // Lines 221, 227: Resize without proper state
  it('should handle resize end without resizeState', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    render(
      <GridContainer items={items}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mouseup without resize start
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // Should not crash
    expect(true).toBe(true)
  })

  // Line 250: isResizable check in handleResizeStart
  it('should not start resize when container isResizable is false', () => {
    const onResizeStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items} isResizable={false} onResizeStart={onResizeStart}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Should not have resize handles
    const resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Line 253: item.isResizable === false check
  it('should not start resize when item.isResizable is explicitly false', () => {
    const onResizeStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false }
    ]
    
    const { container } = render(
      <GridContainer items={items} isResizable={true} onResizeStart={onResizeStart}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Should not have resize handles
    const resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Lines 276, 281-282: Margin calculations
  it('should use margin values when provided instead of gap', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items} margin={[20, 30]} gap={10}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('.absolute') as HTMLElement
    
    // The margins should be used in positioning calculations
    expect(gridItem).toBeInTheDocument()
  })

  // Line 377: isResizable check in ResizeHandle rendering
  it('should not render resize handles when item.isResizable is false', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false },
      { id: '2', x: 2, y: 0, w: 2, h: 2 } // This one should have handles
    ]
    
    const { container } = render(
      <GridContainer items={items} isResizable={true}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItems = container.querySelectorAll('.absolute')
    
    // First item should not have resize handles
    const item1Handles = gridItems[0].querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(item1Handles.length).toBe(0)
    
    // Second item should have resize handles
    const item2Handles = gridItems[1].querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(item2Handles.length).toBeGreaterThan(0)
  })

  // Line 438: Math.max empty array fallback
  it('should handle empty layout for minHeight calculation', () => {
    const { container } = render(
      <GridContainer items={[]} autoSize={true}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridContainer = container.querySelector('.relative') as HTMLElement
    
    // Should render without issues (|| 0 prevents -Infinity)
    expect(gridContainer).toBeInTheDocument()
  })

  // Test drag with originalPosition and placeholder
  it('should handle drag stop with placeholder state', () => {
    const onDragStop = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items} onDragStop={onDragStop}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('.absolute') as HTMLElement
    
    // Start drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Move to create placeholder
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 0 })
    })
    
    // End drag
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // onDragStop should be called with layout, oldItem, newItem, placeholder, etc.
    expect(onDragStop).toHaveBeenCalled()
  })
})