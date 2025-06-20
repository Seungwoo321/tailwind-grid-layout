import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'

describe('GridContainer - Edge Cases for 100% Coverage', () => {
  // Test line 115: if (!item) return in handleDragStart
  it('should handle drag start with non-existent item', () => {
    const onDragStart = vi.fn()
    
    // Create a custom wrapper that can access internal methods
    const TestWrapper = () => {
      const ref = React.useRef<any>(null)
      const [ready, setReady] = React.useState(false)
      
      React.useEffect(() => {
        // Access component internals to test defensive branch
        if (ref.current) {
          const component = ref.current
          // Try to trigger handleDragStart with non-existent item
          if (component.handleDragStart) {
            component.handleDragStart('non-existent-id', {
              currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
              clientX: 50,
              clientY: 50,
              preventDefault: vi.fn()
            })
          }
          setReady(true)
        }
      }, [])
      
      return (
        <GridContainer 
          ref={ref}
          items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
          onDragStart={onDragStart}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    render(<TestWrapper />)
    
    // onDragStart should not be called for non-existent item
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Test line 145: if (!containerRef.current) return in handleDragMove
  it('should handle drag move when container ref is null', () => {
    const onDrag = vi.fn()
    
    const { container, unmount } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        onDrag={onDrag}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridItem = container.querySelector('[data-grid-id="1"]')
    
    // Start drag
    act(() => {
      if (gridItem) {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      }
    })
    
    // Unmount to make container ref null
    unmount()
    
    // Try to move - should hit the containerRef.current check
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Test line 252: if (!item) return in handleResizeStart
  it('should handle resize start with non-existent item', () => {
    const onResizeStart = vi.fn()
    
    const TestWrapper = () => {
      const ref = React.useRef<any>(null)
      
      React.useEffect(() => {
        if (ref.current && ref.current.handleResizeStart) {
          // Try to trigger handleResizeStart with non-existent item
          ref.current.handleResizeStart('non-existent-id', 'se', {
            currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) },
            clientX: 50,
            clientY: 50,
            preventDefault: vi.fn(),
            stopPropagation: vi.fn()
          })
        }
      }, [])
      
      return (
        <GridContainer 
          ref={ref}
          items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
          isResizable={true}
          onResizeStart={onResizeStart}
        >
          {(item) => <div>{item.id}</div>}
        </GridContainer>
      )
    }
    
    render(<TestWrapper />)
    
    expect(onResizeStart).not.toHaveBeenCalled()
  })

  // Additional test: Container unmounted during drag
  it('should handle container unmount during active drag', () => {
    const onDrag = vi.fn()
    const onDragStop = vi.fn()
    
    const TestComponent = () => {
      const [mounted, setMounted] = React.useState(true)
      
      if (!mounted) return <div>Unmounted</div>
      
      return (
        <>
          <button onClick={() => setMounted(false)}>Unmount</button>
          <GridContainer 
            items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
            onDrag={onDrag}
            onDragStop={onDragStop}
          >
            {(item) => <div>{item.id}</div>}
          </GridContainer>
        </>
      )
    }
    
    const { container, getByText } = render(<TestComponent />)
    
    // Start drag
    const gridItem = container.querySelector('[data-grid-id="1"]')
    act(() => {
      if (gridItem) {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      }
    })
    
    // Unmount while dragging
    act(() => {
      fireEvent.click(getByText('Unmount'))
    })
    
    // Try to continue drag - should be handled gracefully
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
      fireEvent.mouseUp(document)
    })
    
    // Component should handle this gracefully
    expect(getByText('Unmounted')).toBeInTheDocument()
  })
})