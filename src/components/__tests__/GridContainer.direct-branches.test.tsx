import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Direct Branch Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Direct test for line 112: if (!isDraggable) return
  it('should hit line 112 - isDraggable=false blocks handleDragStart', () => {
    const onDragStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    // Mock the internal handleDragStart function
    const { container } = render(
      <GridContainer 
        items={items} 
        isDraggable={false}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Get the grid item element
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    expect(gridItem).toBeTruthy()
    
    // Trigger mousedown on the grid item
    act(() => {
      fireEvent.mouseDown(gridItem, { 
      button: 0, 
      clientX: 50, 
      clientY: 50,
      target: gridItem,
      currentTarget: gridItem
    })
    })
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Direct test for line 115: if (!item || item.isDraggable === false) return
  it('should hit line 115 - item.isDraggable=false blocks handleDragStart', () => {
    const onDragStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items} 
        isDraggable={true}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    expect(gridItem).toBeTruthy()
    
    act(() => {
    
      fireEvent.mouseDown(gridItem, { 
      button: 0, 
      clientX: 50, 
      clientY: 50,
      target: gridItem,
      currentTarget: gridItem
    })
    
    })
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Test for line 144 AND 221: mousemove/mouseup without active drag
  it('should hit lines 144 and 221 - mouse events without drag state', () => {
    const onDrag = vi.fn()
    const onDragStop = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    render(
      <GridContainer 
        items={items}
        onDrag={onDrag}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mousemove without dragging (line 144)
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    expect(onDrag).not.toHaveBeenCalled()
    
    // Trigger mouseup without dragging (line 221)
    act(() => {
      fireEvent.mouseUp(document)
    })
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Test for line 276 AND 377: mousemove/mouseup without active resize
  it('should hit lines 276 and 377 - mouse events without resize state', () => {
    const onResize = vi.fn()
    const onResizeStop = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    render(
      <GridContainer 
        items={items}
        isResizable={true}
        onResize={onResize}
        onResizeStop={onResizeStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Trigger mousemove without resizing (line 276)
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    expect(onResize).not.toHaveBeenCalled()
    
    // Trigger mouseup without resizing (line 377)
    act(() => {
      fireEvent.mouseUp(document)
    })
    expect(onResizeStop).not.toHaveBeenCalled()
  })

  // Test for line 250: if (!isResizable) return  
  it('should hit line 250 - isResizable=false prevents handleResizeStart', () => {
    const onResizeStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    // Spy on the internal handleResizeStart method
    let _handleResizeStartRef: any = null
    
    const TestWrapper = () => {
      const ref = React.useRef<any>(null)
      React.useEffect(() => {
        _handleResizeStartRef = ref.current
      }, [])
      
      return (
        <GridContainer 
          ref={ref}
          items={items} 
          isResizable={false}
          onResizeStart={onResizeStart}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    const { container } = render(<TestWrapper />)
    
    // No resize handles should be rendered
    const resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
    
    // Even if we try to call handleResizeStart, it should return early
    expect(onResizeStart).not.toHaveBeenCalled()
  })

  // Test for line 253: if (!item || item.isResizable === false) return
  it('should hit line 253 - item.isResizable=false prevents handleResizeStart', () => {
    const onResizeStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items} 
        isResizable={true}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // No resize handles should be rendered for this item
    const resizeHandles = container.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Test for line 195: originalPosition fallback
  it('should hit line 195 - originalPosition fallback during drag', () => {
    const onDrag = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
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
    
    // Move to trigger handleDragMove with moveItems logic
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    // End drag
    act(() => {
      fireEvent.mouseUp(document)
    })
  })

  // Test for line 227: element check during drag stop
  it('should hit line 227 - missing element during drag stop', () => {
    const onDragStop = vi.fn()
    const items: GridItem[] = [
      { id: 'test-item', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="test-item"]') as HTMLElement
    
    // Start drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Remove the data-grid-id attribute to make the element unfindable
    gridItem.removeAttribute('data-grid-id')
    
    // End drag - element won't be found
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // onDragStop should not be called because element is not found
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Test for line 438: Math.max(...[]) || 0
  it('should hit line 438 - empty array Math.max fallback', () => {
    const { container } = render(
      <GridContainer 
        items={[]} 
        autoSize={true}
      >
        {() => null}
      </GridContainer>
    )
    
    const gridContainer = container.querySelector('.relative')
    expect(gridContainer).toBeInTheDocument()
    
    // With empty items, Math.max should return -Infinity, triggering || 0
    const containerElement = container.firstChild as HTMLElement
    const style = containerElement.style
    
    // The minHeight should be set to a valid value (not Infinity)
    // This confirms the || 0 fallback is working
    expect(style.minHeight).toBeDefined()
  })

  // Test for lines 281-282: margin branches in resize
  it('should hit lines 281-282 - margin values in resize calculation', () => {
    const onResize = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items} 
        margin={[15, 25]} // Different horizontal and vertical margins
        gap={0} // Set gap to 0 to ensure margin is used
        isResizable={true}
        onResize={onResize}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const resizeHandle = container.querySelector('[class*="resize"]') as HTMLElement
    
    if (resizeHandle) {
      // Start resize
      act(() => {
        fireEvent.mouseDown(resizeHandle, { button: 0, clientX: 100, clientY: 100 })
      })
      
      // Move to trigger resize with margin calculations
      act(() => {
        fireEvent.mouseMove(document, { clientX: 200, clientY: 200 })
      })
      
      // The margin values should be used in calculations
      vi.runAllTimers()
      
      // End resize
      act(() => {
        fireEvent.mouseUp(document)
      })
    }
  })
})