import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import React from 'react'
import { DroppableGridContainer } from '../DroppableGridContainer'
import type { GridItem } from '../../types'

describe('DroppableGridContainer - Coverage Tests', () => {
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 }
  ]

  let mockGetBoundingClientRect: any
  let container: HTMLElement

  beforeEach(() => {
    // Save original
    mockGetBoundingClientRect = Element.prototype.getBoundingClientRect
  })

  afterEach(() => {
    // Restore original
    Element.prototype.getBoundingClientRect = mockGetBoundingClientRect
    vi.clearAllMocks()
  })

  it('should hide overlay when dragging leaves container bounds (coverage lines 40-41)', async () => {
    // First render with normal getBoundingClientRect
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Setup mock after component is rendered and ref is set
    let callCount = 0
    const mockRect = {
      left: 100,
      top: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => ({})
    }
    
    // Mock getBoundingClientRect only for our container
    container.getBoundingClientRect = vi.fn(() => {
      callCount++
      return mockRect as DOMRect
    })

    // Trigger dragOver to set isDraggingOver to true
    await act(async () => {
      fireEvent.dragOver(container)
    })
    
    // Verify overlay is shown
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Fire dragLeave with coordinates outside the bounds
    // This should trigger lines 40-41
    const dragLeaveEvent = new MouseEvent('dragleave', {
      bubbles: true,
      cancelable: true,
      clientX: 50,  // Less than rect.left (100)
      clientY: 50   // Less than rect.top (100)
    })
    
    await act(async () => {
      container.dispatchEvent(dragLeaveEvent)
    })
    
    // Wait for state update
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).not.toBeInTheDocument()
    })
    
    // Verify getBoundingClientRect was called
    expect(callCount).toBeGreaterThan(0)
  })

  it('should also hide overlay when coordinates are to the right/bottom of bounds', async () => {
    const { container: rootContainer } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect for this specific container
    container.getBoundingClientRect = vi.fn(() => ({
      left: 100,
      top: 100,
      right: 200,
      bottom: 200,
      width: 100,
      height: 100,
      x: 100,
      y: 100,
      toJSON: () => ({})
    } as DOMRect))

    // Trigger dragOver
    await act(async () => {
      fireEvent.dragOver(container)
    })
    expect(container.querySelector('.bg-blue-500\\/10')).toBeInTheDocument()
    
    // Fire dragLeave with coordinates beyond right/bottom bounds
    const dragLeaveEvent = new MouseEvent('dragleave', {
      bubbles: true,
      cancelable: true,
      clientX: 250,  // Greater than rect.right (200)
      clientY: 250   // Greater than rect.bottom (200)
    })
    
    await act(async () => {
      container.dispatchEvent(dragLeaveEvent)
    })
    
    await waitFor(() => {
      expect(container.querySelector('.bg-blue-500\\/10')).not.toBeInTheDocument()
    })
  })

  it('should test droppingItem with undefined w and h (coverage lines 77-79)', () => {
    const onDrop = vi.fn()
    const droppingItem = {} // No w or h properties
    
    const { container: rootContainer } = render(
      <DroppableGridContainer 
        items={defaultItems} 
        onDrop={onDrop}
        droppingItem={droppingItem}
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect
    container.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 1200,
      bottom: 600,
      width: 1200,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect))
    
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ someData: 'test' }))
    }

    // Drop at a position that would require w calculation
    act(() => {
      fireEvent.drop(container, {
        dataTransfer,
        clientX: 1150, // Near the right edge
        clientY: 100
      })
    })

    // The dropped item should use default w: 2, h: 2
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        w: 2,
        h: 2,
        x: expect.any(Number)
      })
    )
  })

  it('should test droppingItem null checks in calculations', () => {
    const onDrop = vi.fn()
    
    // Test with null/undefined droppingItem properties
    const { container: rootContainer } = render(
      <DroppableGridContainer 
        items={defaultItems} 
        onDrop={onDrop}
        droppingItem={{ w: null as any, h: undefined }}
      >
        {(item) => <div>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    container = rootContainer.querySelector('.relative')! as HTMLElement
    
    // Mock getBoundingClientRect
    container.getBoundingClientRect = vi.fn(() => ({
      left: 0,
      top: 0,
      right: 1200,
      bottom: 600,
      width: 1200,
      height: 600,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect))
    
    const dataTransfer = {
      getData: vi.fn(() => JSON.stringify({ id: 'test-item' }))
    }

    act(() => {
      fireEvent.drop(container, {
        dataTransfer,
        clientX: 600,
        clientY: 300
      })
    })

    // Should use fallback values (2) for null/undefined w and h
    expect(onDrop).toHaveBeenCalledWith(
      expect.objectContaining({
        w: 2,
        h: 2
      })
    )
  })
})