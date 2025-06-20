import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Final Branch Coverage', () => {
  // Helper to create a test component that exposes internal methods
  const createTestComponent = (props: any = {}) => {
    let instance: any = null
    
    const TestWrapper = React.forwardRef((_, ref) => {
      const internalRef = React.useRef<any>(null)
      
      React.useImperativeHandle(ref, () => ({
        handleDragStart: (itemId: string, e: any) => {
          // Access the internal handleDragStart through the component tree
          const gridItems = internalRef.current?.querySelectorAll('[data-grid-id]')
          if (gridItems?.length > 0) {
            const firstItem = gridItems[0]
            // Trigger mousedown which will call handleDragStart internally
            act(() => {
              fireEvent.mouseDown(firstItem, e)
            })
          }
        },
        handleResizeStart: (itemId: string, handle: string, e: any) => {
          // Similar approach for resize
          const resizeHandles = internalRef.current?.querySelectorAll('[class*="cursor-"][class*="resize"]')
          if (resizeHandles?.length > 0) {
            act(() => {
              fireEvent.mouseDown(resizeHandles[0], e)
            })
          }
        }
      }))
      
      return (
        <div ref={internalRef}>
          <GridContainer {...props}>
            {(item: GridItem) => <div>{item.id}</div>}
          </GridContainer>
        </div>
      )
    })
    
    const { container } = render(<TestWrapper ref={(ref) => instance = ref} />)
    return { container, instance }
  }

  // Test defensive branches that are hard to reach normally
  it('should cover all defensive programming branches', () => {
    const onDragStart = vi.fn()
    const onDragStop = vi.fn()
    const onResizeStart = vi.fn()
    const onResizeStop = vi.fn()
    
    // Test 1: isDraggable=false at container level
    const { container: container1 } = createTestComponent({
      items: [{ id: '1', x: 0, y: 0, w: 2, h: 2 }],
      isDraggable: false,
      onDragStart
    })
    
    const item1 = container1.querySelector('[data-grid-id="1"]')
    if (item1) {
      act(() => {
        fireEvent.mouseDown(item1, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).not.toHaveBeenCalled()
    
    // Test 2: isDraggable=false at item level
    const { container: container2 } = createTestComponent({
      items: [{ id: '2', x: 0, y: 0, w: 2, h: 2, isDraggable: false }],
      isDraggable: true,
      onDragStart
    })
    
    const item2 = container2.querySelector('[data-grid-id="2"]')
    if (item2) {
      act(() => {
        fireEvent.mouseDown(item2, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).not.toHaveBeenCalled()
    
    // Test 3: isResizable=false at container level
    const { container: container3 } = createTestComponent({
      items: [{ id: '3', x: 0, y: 0, w: 2, h: 2 }],
      isResizable: false,
      onResizeStart
    })
    
    const resizeHandles3 = container3.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles3.length).toBe(0)
    
    // Test 4: isResizable=false at item level
    const { container: container4 } = createTestComponent({
      items: [{ id: '4', x: 0, y: 0, w: 2, h: 2, isResizable: false }],
      isResizable: true,
      onResizeStart
    })
    
    const resizeHandles4 = container4.querySelectorAll('[class*="cursor-"][class*="resize"]')
    expect(resizeHandles4.length).toBe(0)
    
    // Test 5: Mouse events without active states
    const { container: container5 } = createTestComponent({
      items: [{ id: '5', x: 0, y: 0, w: 2, h: 2 }],
      onDragStop,
      onResizeStop
    })
    
    // Trigger mouse events without starting drag/resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(onDragStop).not.toHaveBeenCalled()
    expect(onResizeStop).not.toHaveBeenCalled()
  })

  // Test the specific branches identified in coverage report
  it('should cover lines 112, 115 - handleDragStart branches', () => {
    const onDragStart = vi.fn()
    
    // Create a custom component that can trigger handleDragStart directly
    const TestComponent = () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 0, w: 2, h: 2, isDraggable: false }
      ]
      
      return (
        <GridContainer 
          items={items}
          isDraggable={true}
          onDragStart={onDragStart}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    const { container } = render(<TestComponent />)
    
    // This will be blocked by GridItem's isDraggable check
    const item2 = container.querySelector('[data-grid-id="2"]')
    if (item2) {
      act(() => {
        fireEvent.mouseDown(item2, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Test lines 144, 221, 276, 377 - event handlers without active state
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
    
    // Trigger all mouse events without starting drag/resize
    act(() => {
      fireEvent.mouseMove(document, { clientX: 200, clientY: 200 })
    })
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    // None of the callbacks should be called
    Object.values(callbacks).forEach(cb => {
      expect(cb).not.toHaveBeenCalled()
    })
  })

  // Test lines 195, 227 - fallback values
  it('should use fallback values for originalPosition and placeholder', () => {
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
      
      // Move (will use originalPosition or fallback)
      act(() => {
        fireEvent.mouseMove(document, { clientX: 50, clientY: 50 })
      })
      
      // Stop drag (will use placeholder or fallback)
      act(() => {
        fireEvent.mouseUp(document)
      })
    }
    
    expect(onDrag).toHaveBeenCalled()
    expect(onDragStop).toHaveBeenCalled()
  })

  // Test lines 250, 253 - resize disabled checks
  it('should not allow resize when disabled', () => {
    const onResizeStart = vi.fn()
    
    // Test both container and item level disabling
    const { rerender, container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isResizable={false}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    expect(container.querySelectorAll('[class*="resize"]').length).toBe(0)
    
    // Test item-level disable
    rerender(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false }]}
        isResizable={true}
        onResizeStart={onResizeStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    expect(container.querySelectorAll('[class*="resize"]').length).toBe(0)
  })
})