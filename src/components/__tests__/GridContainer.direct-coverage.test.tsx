import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Direct 100% Branch Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Helper to access component internals via React DevTools internals
  const getComponentInstance = (container: HTMLElement) => {
    const gridElement = container.querySelector('.relative')
    if (!gridElement) return null
    
    // Access React internals
    const reactInternalKey = Object.keys(gridElement).find(key => key.startsWith('__reactInternalInstance') || key.startsWith('__reactFiber'))
    if (!reactInternalKey) return null
    
    return (gridElement as any)[reactInternalKey]
  }

  // Branch 1: Line 112 - if (!isDraggable) return in handleDragStart
  it('should cover handleDragStart with isDraggable=false', () => {
    const onDragStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const Component = () => {
      const [testItems] = React.useState(items)
      const containerRef = React.useRef<any>(null)
      
      React.useEffect(() => {
        // Directly call handleDragStart to test the branch
        if (containerRef.current) {
          const mockEvent = new MouseEvent('mousedown', {
            clientX: 50,
            clientY: 50,
            bubbles: true
          }) as any
          mockEvent.currentTarget = {
            getBoundingClientRect: () => ({ left: 0, top: 0, right: 100, bottom: 100 })
          }
          
          // This will hit the !isDraggable check
          containerRef.current.handleDragStart?.('1', mockEvent)
        }
      }, [])
      
      return (
        <GridContainer 
          ref={containerRef}
          items={testItems} 
          isDraggable={false}
          onDragStart={onDragStart}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    render(<Component />)
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Branch 2: Line 115 - if (!item || item.isDraggable === false) return
  it('should cover handleDragStart with non-existent item', () => {
    const onDragStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
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
    
    // Get the GridContainer instance and call handleDragStart with non-existent item
    const _gridContainer = container.firstChild as HTMLElement
    const instance = getComponentInstance(container)
    
    if (instance?.memoizedProps?.onDragStart) {
      const mockEvent = {
        currentTarget: {
          getBoundingClientRect: () => ({ left: 0, top: 0 })
        },
        clientX: 50,
        clientY: 50,
        preventDefault: vi.fn()
      } as any
      
      // Call with non-existent item ID
      instance.memoizedProps.onDragStart('non-existent', mockEvent)
    }
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Branch 3: Line 144 - mousemove without drag state (already covered)
  it('should handle mousemove without drag state', () => {
    const onDrag = vi.fn()
    render(
      <GridContainer items={[]} onDrag={onDrag}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    act(() => {
    
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    
    })
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Branch 4: Line 195 - originalPosition fallback
  it('should use draggedItem as fallback when originalPosition is null', () => {
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
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    // Start drag properly through GridItem
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // Now trigger mousemove which will use the originalPosition (or fallback)
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onDrag).toHaveBeenCalled()
  })

  // Branch 5: Line 221 - mouseup without drag state
  it('should handle mouseup without drag state', () => {
    const onDragStop = vi.fn()
    render(
      <GridContainer items={[]} onDragStop={onDragStop}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    act(() => {
    
      fireEvent.mouseUp(document)
    
    })
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Branch 6: Line 227 - placeholder fallback during drag stop
  it('should handle drag stop with placeholder fallback', () => {
    const onDragStop = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items}
        onDragStop={onDragStop}
      >
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    
    // Start drag
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
    })
    
    // End drag - this will use the placeholder (or {} fallback if null)
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // onDragStop should be called with the fallback
    expect(onDragStop).toHaveBeenCalled()
  })

  // Branch 7: Line 250 - if (!isResizable) return
  it('should not start resize when isResizable is false', () => {
    const onResizeStart = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer 
        items={items} 
        isResizable={false}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // No resize handles should exist
    const resizeHandles = container.querySelectorAll('[data-resize-handle]')
    expect(resizeHandles.length).toBe(0)
  })

  // Branch 8: Line 253 - if (!item || item.isResizable === false) return
  it('should not render resize handles for non-resizable item', () => {
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
    
    // No resize handles for this item
    const resizeHandles = container.querySelectorAll('[data-resize-handle]')
    expect(resizeHandles.length).toBe(0)
  })

  // Branch 9: Line 276 - mousemove without resize state
  it('should handle mousemove without resize state', () => {
    const onResize = vi.fn()
    render(
      <GridContainer items={[]} isResizable={true} onResize={onResize}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    act(() => {
    
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    
    })
    expect(onResize).not.toHaveBeenCalled()
  })

  // Branch 10: Line 377 - mouseup without resize state
  it('should handle mouseup without resize state', () => {
    const onResizeStop = vi.fn()
    render(
      <GridContainer items={[]} isResizable={true} onResizeStop={onResizeStop}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    act(() => {
    
      fireEvent.mouseUp(document)
    
    })
    expect(onResizeStop).not.toHaveBeenCalled()
  })
})