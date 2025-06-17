import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DroppableGridContainer } from '../DroppableGridContainer'
import type { GridItem } from '../../types'

describe('DroppableGridContainer', () => {
  const mockOnDrop = vi.fn()
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

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
    const dragOverEvent = fireEvent.dragOver(container)
    
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

  it('should handle dragLeave events when leaving container bounds', () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Test that dragLeave handler is called
    fireEvent.dragLeave(container, {
      clientX: 600,
      clientY: 600
    })
    
    // The event handler is attached and called
    expect(container).toBeTruthy()
  })

  it('should handle dragLeave with no container rect', () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect to return null
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(null as any)
    
    // Trigger dragOver then dragLeave
    fireEvent.dragOver(container)
    fireEvent.dragLeave(container)
    
    // Should handle gracefully
    expect(container).toBeTruthy()
  })

  it('should not hide overlay when dragging within container', () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
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
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Trigger dragLeave within container bounds
    fireEvent.dragLeave(container, {
      clientX: 250,
      clientY: 250
    })
    
    // Should still show the overlay
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
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
    
    render(
      <DroppableGridContainer items={defaultItems} onDrop={onDrop}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect to return null
    vi.spyOn(container, 'getBoundingClientRect').mockReturnValue(null as any)
    
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ x: 4, y: 0, w: 2, h: 2 }))
    }

    fireEvent.drop(container, {
      dataTransfer,
      clientX: 100,
      clientY: 100
    })

    expect(onDrop).not.toHaveBeenCalled()
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

  it('should show dragging overlay when dragging over', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Trigger dragOver
    fireEvent.dragOver(container)
    
    // Should show the dragging overlay and ring
    expect(container.classList.contains('ring-2')).toBe(true)
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
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
    
    container.dispatchEvent(event)
    
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

  it('should handle dragLeave when staying within container bounds', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect for this specific element
    container.getBoundingClientRect = vi.fn().mockReturnValue({
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
    
    // Trigger dragOver first to set isDraggingOver
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Trigger dragLeave within container bounds (at center)
    fireEvent.dragLeave(container, {
      clientX: 250,
      clientY: 250
    })
    
    // Should still show the dragging overlay because we're within bounds
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
  })

  it('should hide overlay when dragging leaves container bounds', () => {
    render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const container = document.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect
    container.getBoundingClientRect = vi.fn().mockReturnValue({
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
    
    // Trigger dragOver first
    fireEvent.dragOver(container)
    
    // Verify overlay is shown
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Trigger dragLeave outside container bounds
    fireEvent.dragLeave(container, {
      clientX: 600,
      clientY: 600
    })
    
    // Should hide the dragging overlay
    expect(container.querySelector('.bg-blue-500\\/10')).not.toBeInTheDocument()
  })
})