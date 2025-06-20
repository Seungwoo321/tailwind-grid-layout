import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem, GridContainerProps } from '../../types'

describe('GridContainer - Complete Branch Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Test branch 1 & 2: Lines 112 & 115 - handleDragStart branches
  it('should not call onDragStart when dragging is disabled at container or item level', () => {
    const onDragStart = vi.fn()
    
    // Test 1: Container level isDraggable=false
    const { rerender } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]} 
        isDraggable={false}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // The GridItem won't call onDragStart because isDraggable prop is false
    const gridItem1 = document.querySelector('[data-grid-id="1"]') as HTMLElement
    act(() => {
      fireEvent.mouseDown(gridItem1, { button: 0, clientX: 0, clientY: 0 })
    })
    expect(onDragStart).not.toHaveBeenCalled()
    
    // Test 2: Item level isDraggable=false
    rerender(
      <GridContainer 
        items={[{ id: '2', x: 0, y: 0, w: 2, h: 2, isDraggable: false }]} 
        isDraggable={true}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem2 = document.querySelector('[data-grid-id="2"]') as HTMLElement
    act(() => {
      fireEvent.mouseDown(gridItem2, { button: 0, clientX: 0, clientY: 0 })
    })
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Test branch 3: Line 144 - handleDragMove without drag state
  it('should not process drag move without active drag state', () => {
    const onDrag = vi.fn()
    
    render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        onDrag={onDrag}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mousemove without starting drag
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Test branch 4: Line 195 - originalPosition fallback
  it('should handle drag with originalPosition fallback', () => {
    const onDrag = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items}
        preventCollision={false}
        allowOverlap={false}
        onDrag={onDrag}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    
    // Start drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Move to trigger drag - the fallback will be used internally
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onDrag).toHaveBeenCalled()
  })

  // Test branch 5: Line 221 - handleDragEnd without drag state
  it('should not process drag end without active drag state', () => {
    const onDragStop = vi.fn()
    
    render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mouseup without starting drag
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Test branch 6: Line 227 - placeholder fallback during drag stop
  it('should handle drag stop with placeholder fallback', () => {
    const onDragStop = vi.fn()
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    
    const { container } = render(
      <GridContainer 
        items={items}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    
    // Start and end drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(onDragStop).toHaveBeenCalled()
    // The fallback {} will be used for placeholder if it's null
  })

  // Test branch 7 & 8: Lines 250 & 253 - handleResizeStart branches
  it('should not start resize when disabled at container or item level', () => {
    const onResizeStart = vi.fn()
    
    // Test 1: Container level isResizable=false
    const { rerender, container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]} 
        isResizable={false}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // No resize handles should be rendered
    let resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
    
    // Test 2: Item level isResizable=false
    rerender(
      <GridContainer 
        items={[{ id: '2', x: 0, y: 0, w: 2, h: 2, isResizable: false }]} 
        isResizable={true}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // No resize handles for this specific item
    resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Test branch 9: Line 276 - handleResizeMove without resize state
  it('should not process resize move without active resize state', () => {
    const onResize = vi.fn()
    
    render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isResizable={true}
        onResize={onResize}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mousemove without starting resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onResize).not.toHaveBeenCalled()
  })

  // Test branch 10: Line 377 - handleResizeEnd without resize state
  it('should not process resize end without active resize state', () => {
    const onResizeStop = vi.fn()
    
    render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isResizable={true}
        onResizeStop={onResizeStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mouseup without starting resize
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(onResizeStop).not.toHaveBeenCalled()
  })

  // Additional test: Ensure all defensive branches are covered
  it('should handle edge cases in drag and resize operations', () => {
    const onDragStart = vi.fn()
    const onDragStop = vi.fn()
    const onResizeStart = vi.fn()
    const onResizeStop = vi.fn()
    
    const TestComponent = () => {
      const [items, setItems] = React.useState<GridItem[]>([
        { id: '1', x: 0, y: 0, w: 2, h: 2 }
      ])
      
      return (
        <GridContainer 
          items={items}
          onDragStart={onDragStart}
          onDragStop={onDragStop}
          onResizeStart={onResizeStart}
          onResizeStop={onResizeStop}
        >
          {(item) => (
            <div>
              <span>{item.id}</span>
              <button onClick={() => setItems([])}>Clear</button>
            </div>
          )}
        </GridContainer>
      )
    }
    
    const { container } = render(<TestComponent />)
    
    // Start drag
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Clear items while dragging
    const clearButton = container.querySelector('button') as HTMLElement
    fireEvent.click(clearButton)
    
    // Try to end drag after item is removed
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // Callbacks should have been called appropriately
    expect(onDragStart).toHaveBeenCalled()
    // onDragStop might not be called if item doesn't exist
  })
})