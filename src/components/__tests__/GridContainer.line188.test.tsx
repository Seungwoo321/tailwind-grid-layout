import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Line 188 Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('should handle null containerRef during drag move (line 188)', () => {
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    const onDrag = vi.fn()
    const onDragStop = vi.fn()
    
    // Create a wrapper that will unmount the grid during drag
    const TestWrapper = () => {
      const [mounted, setMounted] = React.useState(true)
      
      // Store drag state to ensure we can trigger mousemove after unmount
      const [isDragging, setIsDragging] = React.useState(false)
      
      React.useEffect(() => {
        if (isDragging && mounted) {
          // Unmount after a brief delay to ensure drag is started
          const timer = setTimeout(() => {
            setMounted(false)
          }, 10)
          return () => clearTimeout(timer)
        }
      }, [isDragging, mounted])
      
      React.useEffect(() => {
        if (isDragging && !mounted) {
          // After unmount, trigger a mouse move
          // This should hit line 188 where containerRef.current is null
          const moveEvent = new MouseEvent('mousemove', {
            clientX: 300,
            clientY: 300,
            bubbles: true
          })
          document.dispatchEvent(moveEvent)
        }
      }, [isDragging, mounted])
      
      if (!mounted) {
        return <div>Unmounted</div>
      }
      
      return (
        <GridContainer 
          items={items} 
          isDraggable={true} 
          onDrag={onDrag}
          onDragStop={onDragStop}
          onDragStart={() => setIsDragging(true)}
        >
          {(item) => <div>Item {item.id}</div>}
        </GridContainer>
      )
    }
    
    const { container } = render(<TestWrapper />)
    
    // Find and start dragging the grid item
    const gridItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    expect(gridItem).toBeTruthy()
    
    act(() => {
      fireEvent.mouseDown(gridItem, { button: 0, clientX: 100, clientY: 100 })
    })
    
    // Wait for the component to unmount and the mouse move to be triggered
    act(() => {
      vi.advanceTimersByTime(20)
    })
    
    // Verify the component unmounted
    expect(container.textContent).toBe('Unmounted')
    
    // Verify onDrag was not called (because containerRef was null)
    expect(onDrag).not.toHaveBeenCalled()
    
    // Clean up by triggering mouseup
    act(() => {
      fireEvent.mouseUp(document)
    })
  })
})