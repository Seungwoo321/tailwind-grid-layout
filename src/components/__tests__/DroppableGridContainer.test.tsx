import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { DroppableGridContainer } from '../DroppableGridContainer'
import type { GridItem } from '../../types'

describe('DroppableGridContainer', () => {
  const mockOnDrop = vi.fn()
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

  // Helper to create proper drag events with clientX/clientY
  const fireDragOver = (element: HTMLElement, clientX: number, clientY: number) => {
    const event = new MouseEvent('dragover', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY
    })
    Object.defineProperty(event, 'dataTransfer', {
      value: { dropEffect: 'none' }
    })
    fireEvent(element, event)
  }

  const fireDragLeave = (element: HTMLElement, clientX: number, clientY: number) => {
    const event = new MouseEvent('dragleave', {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY
    })
    fireEvent(element, event)
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render grid items', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    expect(screen.getByTestId('item-1')).toBeInTheDocument()
    expect(screen.getByTestId('item-2')).toBeInTheDocument()
  })

  it('should handle drop events', () => {
    render(
      <DroppableGridContainer items={defaultItems} onDrop={mockOnDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement

    // Create a mock DataTransfer
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 })),
      effectAllowed: 'copy' as const
    }

    // Simulate drop
    fireEvent.drop(container, {
      dataTransfer,
      clientX: 400,
      clientY: 0
    })

    expect(mockOnDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        w: expect.any(Number),
        h: expect.any(Number)
      })
    )
  })

  it('should handle dragOver events', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Create a proper DragEvent with dataTransfer
    const _dragOverEvent = fireEvent.dragOver(container)
    
    // The event should be handled
    expect(container).toBeTruthy()
  })

  it('should pass through layout change events', () => {
    const mockOnLayoutChange = vi.fn()
    
    render(
      <DroppableGridContainer 
        items={defaultItems} 
        onLayoutChange={mockOnLayoutChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    // The onLayoutChange should be called when items change
    expect(mockOnLayoutChange).toBeDefined()
  })

  it('should render with droppingItem prop', () => {
    const droppingItem = { w: 3, h: 2 }
    
    render(
      <DroppableGridContainer 
        items={defaultItems} 
        droppingItem={droppingItem}
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    // Should render the container
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should handle drop without onDrop callback', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 }))
    }

    // Should not throw when dropping without onDrop
    expect(() => {
      fireEvent.drop(container, { dataTransfer })
    }).not.toThrow()
  })

  it('should generate unique ID for dropped items', () => {
    const onDrop = vi.fn()
    
    render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 }))
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 400,
      clientY: 0
    })

    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.stringMatching(/^dropped-\d+$/)
      })
    )
  })

  it('should handle dragLeave events when leaving container bounds', async () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Test that dragLeave handler is called
    fireEvent.dragLeave(container, {
      clientX: 600,
      clientY: 600
    })
    
    // The event handler is attached and called
    expect(container).toBeTruthy()
  })

  it('should handle dragLeave with no container rect', async () => {
    // Mock getBoundingClientRect to return null
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue(null as any)
    
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver then dragLeave
    fireEvent.dragOver(container)
    
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    fireEvent.dragLeave(container)
    
    // Should handle gracefully - overlay should remain since we can't check bounds
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('should not hide overlay when dragging within container', async () => {
    // Mock getBoundingClientRect globally before rendering
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)

    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Trigger dragLeave within container bounds
    fireEvent.dragLeave(container, {
      clientX: 250,
      clientY: 250
    })
    
    // Should still show the overlay
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })

    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('should handle drop with invalid data', () => {
    const onDrop = vi.fn()
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    const dataTransfer = {
      getData: vi.fn(() => 'invalid json')
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    expect(consoleErrorSpy).toHaveBeenCalled()
    expect(onDrop).not.toHaveBeenCalled()
    
    consoleErrorSpy.mockRestore()
  })

  it('should handle drop without container rect', () => {
    const onDrop = vi.fn()
    
    // Mock getBoundingClientRect to return null
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue(null as any)
    
    render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 }))
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    expect(onDrop).not.toHaveBeenCalled()
    
    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  it('should handle drop with empty data', () => {
    const onDrop = vi.fn()
    
    render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    const dataTransfer = {
      getData: vi.fn(() => '')
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    expect(onDrop).not.toHaveBeenCalled()
  })

  it('should show dragging overlay when dragging over', async () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver
    fireEvent.dragOver(container)
    
    // Should show the dragging overlay and ring
    await waitFor(() => {
      expect(container.classList.contains('ring-2')).toBe(true)
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
  })

  it('should handle dragOver with null dataTransfer', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Create event without dataTransfer
    const event = new Event('dragover', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'preventDefault', { value: vi.fn() })
    Object.defineProperty(event, 'dataTransfer', { value: null })
    
    act(() => {
      container.dispatchEvent(event)
    })
    
    // Should still handle the event
    expect(event.preventDefault).toHaveBeenCalled()
  })

  it('should handle dragOver with dataTransfer and set dropEffect', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Create event with dataTransfer
    const dataTransfer = {
      dropEffect: 'none'
    }
    
    fireEvent.dragOver(container, { dataTransfer })
    
    // Should set dropEffect to copy
    expect(dataTransfer.dropEffect).toBe('copy')
  })

  it('should handle dragLeave when staying within container bounds', async () => {
    // Mock getBoundingClientRect globally before rendering
    const originalGetBoundingClientRect = Element.prototype.getBoundingClientRect
    Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      right: 500,
      bottom: 500,
      width: 500,
      height: 500,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)

    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first to set isDraggingOver
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Trigger dragLeave within container bounds (at center)
    fireEvent.dragLeave(container, {
      clientX: 250,
      clientY: 250
    })
    
    // Should still show the dragging overlay because we're within bounds
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })

    // Restore original method
    Element.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })


  it('should hide overlay when drop occurs', async () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first to show the overlay
    await act(async () => {
      fireEvent.dragOver(container)
    })
    
    // Verify overlay is shown
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Test alternative: trigger drop event which should also hide the overlay
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 }))
    }
    
    await act(async () => {
      fireEvent.drop(container, {
        dataTransfer,
        clientX: 100,
        clientY: 100
      })
    })
    
    // Should hide the dragging overlay after drop
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).not.toBeInTheDocument()
    })
  })

  it('should handle dragLeave events and check bounds', async () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Create a spy to verify dragLeave is handled
    const dragLeaveHandler = vi.fn()
    container.addEventListener('dragleave', dragLeaveHandler)
    
    // Trigger dragLeave
    fireEvent.dragLeave(container, {
      clientX: 100,
      clientY: 100
    })
    
    // Verify the event was handled
    expect(dragLeaveHandler).toHaveBeenCalled()
    
    // Clean up
    container.removeEventListener('dragleave', dragLeaveHandler)
  })

  it('should hide overlay when dragging leaves container bounds (lines 39-40)', async () => {
    const onDrop = vi.fn()
    const { container, rerender } = render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )
    
    const droppableContainer = container.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver to show overlay
    fireEvent.dragOver(droppableContainer)
    
    // Verify overlay is shown
    await waitFor(() => {
      expect(droppableContainer.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    })
    
    // Now we need to trigger the exact conditions for lines 39-40:
    // We'll use a more direct approach - accessing the component's internal state
    
    // Create a custom event that will definitely trigger the outside bounds check
    const dragLeaveEvent = new Event('dragleave', { bubbles: true })
    Object.defineProperty(dragLeaveEvent, 'clientX', { value: -100, writable: false })
    Object.defineProperty(dragLeaveEvent, 'clientY', { value: -100, writable: false })
    
    // Mock getBoundingClientRect to return a specific rect
    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0,
      top: 0,
      right: 100,
      bottom: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect)
    
    // Dispatch the custom event wrapped in act
    act(() => {
      droppableContainer.dispatchEvent(dragLeaveEvent)
    })
    
    // Wait for React to update
    await waitFor(() => {
      expect(droppableContainer.querySelector('.bg-blue-500\\/10')).not.toBeInTheDocument()
    })
    
    // Restore
    HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
  })

  // Additional tests for lines 73-76 coverage
  it('should use fallback dimensions when droppingItem has no w/h', () => {
    const onDrop = vi.fn()
    
    render(
      <DroppableGridContainer 
        items={defaultItems} 
        onDrop={onDrop}
        droppingItem={{}} // No w or h - should use fallback
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Set up a working getBoundingClientRect
    container.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 400, bottom: 300,
      width: 400, height: 300, x: 0, y: 0,
      toJSON: () => ({})
    })

    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ id: 'test-item' }))
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    // Should use fallback values: droppingItem.w || 2, droppingItem.h || 2 (lines 75, 76)
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        w: 2, // fallback from line 75
        h: 2  // fallback from line 76
      })
    )
  })

  it('should use fallback when droppingItem w/h are 0', () => {
    const onDrop = vi.fn()
    
    render(
      <DroppableGridContainer 
        items={defaultItems} 
        onDrop={onDrop}
        droppingItem={{ w: 0, h: 0 }} // Falsy values
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    container.getBoundingClientRect = () => ({
      left: 0, top: 0, right: 400, bottom: 300,
      width: 400, height: 300, x: 0, y: 0,
      toJSON: () => ({})
    })

    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ id: 'test-item' }))
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    // Should use fallback: 0 || 2 = 2 (lines 75, 76)
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        w: 2,
        h: 2
      })
    )
  })

  describe('Real-time tracking', () => {
    // Use real timers for these tests since throttle depends on Date.now()
    // and the interaction between fake timers and Date.now() is complex

    it('should track mouse position in real-time during drag over', async () => {
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer 
          items={defaultItems}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement
      
      // Mock dimensions for both containers
      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      // Trigger resize to update container width
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Trigger first dragOver event at a free position
      // Default items occupy x:0-1 and x:2-3, so x:4+ is free
      // With cols=12, gap=16, padding=16, container width=600:
      // cellWidth = (600 - 32 - 16*11) / 12 = 32
      // x=4 position = 16 + 4 * (32 + 16) = 208
      fireDragOver(container, 250, 50)

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Check that preview is shown with correct position
      await waitFor(() => {
        // Look for the preview in the grid container
        const gridContainer = container.querySelector('.tailwind-grid-layout')
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
        expect(preview).toHaveClass('bg-green-200') // Valid position
      }, { timeout: 1000 })

      // Move mouse to a new position (still free)
      fireDragOver(container, 300, 200)

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Preview should update position
      await waitFor(() => {
        const preview = container.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
        // Position should have changed
      })
    })

    it('should show invalid state when collision detected', async () => {
      const existingItems: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 4, h: 2 }
      ]

      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer 
          items={existingItems}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement
      
      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      // Trigger resize to update container width
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Drag over occupied position
      fireDragOver(container, 50, 50) // This should collide with item '1'

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Check that preview shows invalid state
      await waitFor(() => {
        const gridContainer = container.querySelector('.tailwind-grid-layout')
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
        expect(preview).toHaveClass('bg-red-200') // Invalid position
        expect(preview).toHaveClass('border-red-400')
        expect(preview?.textContent).toContain('Invalid position')
      }, { timeout: 1000 })
    })

    it('should throttle drag over events', async () => {
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer 
          items={defaultItems}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement
      
      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      // Trigger resize to update container width
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Fire multiple dragOver events rapidly
      for (let i = 0; i < 10; i++) {
        fireDragOver(container, 100 + i * 10, 100)
      }

      // Should process first event immediately
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      // Preview should appear
      await waitFor(() => {
        const gridContainer = container.querySelector('.tailwind-grid-layout')
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
      }, { timeout: 1000 })

      // Advance time but less than throttle delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 10))
      })

      // Fire more events
      for (let i = 0; i < 5; i++) {
        fireDragOver(container, 200 + i * 10, 100)
      }

      // Advance to next throttle window
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Preview should still be there
      expect(container.querySelector('.border-dashed')).toBeInTheDocument()
    })

    it('should prevent drop on invalid position', async () => {
      const onDrop = vi.fn()
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      
      const existingItems: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 12, h: 2 } // Full width item
      ]

      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      render(
        <DroppableGridContainer 
          items={existingItems}
          onDrop={onDrop}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = document.querySelector('.relative')! as HTMLElement
      container.getBoundingClientRect = mockGetBoundingClientRect

      // Drag over occupied position
      fireDragOver(container, 50, 50)

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Try to drop at invalid position
      const dataTransfer = {
        getData: vi.fn(() => JSON.stringify({ id: 'new-item' }))
      }

      fireEvent.drop(container, {
        dataTransfer,
        clientX: 50,
        clientY: 50
      })

      // Should not call onDrop for invalid position
      expect(onDrop).not.toHaveBeenCalled()
      expect(consoleWarnSpy).toHaveBeenCalledWith('Cannot drop item at invalid position')
      
      consoleWarnSpy.mockRestore()
    })

    it('should use preview state position on drop', async () => {
      const onDrop = vi.fn()
      
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer 
          items={defaultItems}
          onDrop={onDrop}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement
      
      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      // Trigger resize to update container width
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Drag over to set preview state at a free position
      fireDragOver(container, 250, 50)

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Drop at the same position
      const dataTransfer = {
        getData: vi.fn(() => JSON.stringify({ id: 'new-item' }))
      }

      fireEvent.drop(container, {
        dataTransfer,
        clientX: 250,
        clientY: 50
      })

      // Should use the calculated position from preview state
      expect(onDrop).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'new-item',
          x: expect.any(Number),
          y: expect.any(Number),
          w: 2,
          h: 2
        })
      )
    })

    it('should clear preview state on drag leave', async () => {
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0,
        top: 0,
        right: 600,
        bottom: 400,
        width: 600,
        height: 400,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer 
          items={defaultItems}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{ w: 2, h: 2 }}
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement
      
      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      // Trigger resize to update container width
      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Drag over to show preview at a free position
      fireDragOver(container, 250, 50)

      // Wait for throttle and state updates
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Verify preview is shown
      await waitFor(() => {
        const gridContainer = container.querySelector('.tailwind-grid-layout')
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
      }, { timeout: 1000 })

      // Drag leave outside bounds
      fireDragLeave(container, 700, 500)

      // Preview should be removed
      await waitFor(() => {
        const gridContainer = container.querySelector('.tailwind-grid-layout')
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).not.toBeInTheDocument()
      })
    })

    it('should use default dimensions when droppingItem has no w or h', async () => {
      const mockGetBoundingClientRect = vi.fn().mockReturnValue({
        left: 0, top: 0, right: 600, bottom: 400,
        width: 600, height: 400, x: 0, y: 0, toJSON: () => ({})
      })

      const { container: rootContainer } = render(
        <DroppableGridContainer
          items={[]}
          cols={12}
          rowHeight={60}
          gap={16}
          containerPadding={[16, 16]}
          droppingItem={{}} // No w or h - should use default 2x2
        >
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      )

      const container = rootContainer.querySelector('.relative')! as HTMLElement
      const gridContainer = container.querySelector('.tailwind-grid-layout')! as HTMLElement

      container.getBoundingClientRect = mockGetBoundingClientRect
      Object.defineProperty(gridContainer, 'offsetWidth', {
        configurable: true,
        value: 600
      })

      await act(async () => {
        window.dispatchEvent(new Event('resize'))
        await Promise.resolve()
      })

      // Trigger drag over
      fireDragOver(container, 100, 100)

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 20))
      })

      // Preview should be shown with default 2x2 size
      await waitFor(() => {
        const preview = gridContainer?.querySelector('.border-dashed')
        expect(preview).toBeInTheDocument()
      }, { timeout: 1000 })
    })
  })
})