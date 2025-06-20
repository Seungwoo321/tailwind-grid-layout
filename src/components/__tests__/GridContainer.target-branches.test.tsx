import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Target Specific Uncovered Branches', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  // Line 112: !isDraggable check in handleDragStart
  it('should cover handleDragStart early return when isDraggable=false', () => {
    const onDragStart = vi.fn()
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isDraggable={false}
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // GridItem should exist
    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()

    // Attempt to drag should not trigger onDragStart
    if (gridItem) {
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Line 115: !item || item.isDraggable === false check
  it('should cover handleDragStart with item.isDraggable=false', () => {
    const onDragStart = vi.fn()
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false }]}
        isDraggable={true}  // Container allows dragging
        onDragStart={onDragStart}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    const gridItem = container.querySelector('[data-grid-id="1"]')
    expect(gridItem).toBeTruthy()

    if (gridItem) {
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }
    expect(onDragStart).not.toHaveBeenCalled()
  })

  // Line 144: early return in handleMouseMove when not dragging
  it('should cover handleMouseMove without drag state', () => {
    const onDrag = vi.fn()
    render(
      <GridContainer 
        items={[]}
        onDrag={onDrag}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Mouse move without any drag state should return early
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Line 195: originalPosition fallback in handleMouseMove
  it('should use draggedItem as fallback for originalPosition', () => {
    const onDrag = vi.fn()
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        onDrag={onDrag}
        preventCollision={false}
        allowOverlap={false}
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
      
      // Move - this should use originalPosition or draggedItem fallback
      act(() => {
        fireEvent.mouseMove(document, { clientX: 50, clientY: 50 })
      })
    }

    expect(onDrag).toHaveBeenCalled()
  })

  // Line 221: early return in handleMouseUp when not dragging
  it('should cover handleMouseUp without drag state', () => {
    const onDragStop = vi.fn()
    render(
      <GridContainer 
        items={[]}
        onDragStop={onDragStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Mouse up without any drag state should return early
    act(() => {
      fireEvent.mouseUp(document)
    })
    expect(onDragStop).not.toHaveBeenCalled()
  })

  // Line 227: placeholder fallback in handleMouseUp
  it('should use fallback for placeholder in drag stop', () => {
    const onDragStop = vi.fn()
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
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
      
      // End drag - should use placeholder or fallback
      act(() => {
        fireEvent.mouseUp(document)
      })
    }

    expect(onDragStop).toHaveBeenCalled()
  })

  // Line 250: !isResizable check in renderResizeHandles
  it('should not render resize handles when isResizable=false', () => {
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isResizable={false}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // No resize handles should be rendered
    const resizeHandles = container.querySelectorAll('[class*="cursor-"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Line 253: !item || item.isResizable === false check
  it('should not render resize handles for non-resizable item', () => {
    const { container } = render(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false }]}
        isResizable={true}  // Container allows resizing
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // No resize handles for this specific item
    const resizeHandles = container.querySelectorAll('[class*="cursor-"]')
    expect(resizeHandles.length).toBe(0)
  })

  // Line 276: early return in handleResizeMove when not resizing
  it('should cover handleResizeMove without resize state', () => {
    const onResize = vi.fn()
    render(
      <GridContainer 
        items={[]}
        isResizable={true}
        onResize={onResize}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Mouse move without any resize state should return early
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    expect(onResize).not.toHaveBeenCalled()
  })

  // Line 377: early return in handleResizeUp when not resizing
  it('should cover handleResizeUp without resize state', () => {
    const onResizeStop = vi.fn()
    render(
      <GridContainer 
        items={[]}
        isResizable={true}
        onResizeStop={onResizeStop}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Mouse up without any resize state should return early
    act(() => {
      fireEvent.mouseUp(document)
    })
    expect(onResizeStop).not.toHaveBeenCalled()
  })

  // Comprehensive test covering multiple scenarios
  it('should handle complex interaction scenarios', () => {
    const callbacks = {
      onDragStart: vi.fn(),
      onDrag: vi.fn(),
      onDragStop: vi.fn(),
      onResizeStart: vi.fn(),
      onResize: vi.fn(),
      onResizeStop: vi.fn()
    }

    const { container, rerender } = render(
      <GridContainer 
        items={[
          { id: '1', x: 0, y: 0, w: 2, h: 2 },
          { id: '2', x: 2, y: 0, w: 2, h: 2, isDraggable: false },
          { id: '3', x: 4, y: 0, w: 2, h: 2, isResizable: false }
        ]}
        isDraggable={true}
        isResizable={true}
        {...callbacks}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Test with isDraggable=false at container level
    rerender(
      <GridContainer 
        items={[{ id: '1', x: 0, y: 0, w: 2, h: 2 }]}
        isDraggable={false}  // This should hit line 112
        isResizable={false}  // This should hit line 250
        {...callbacks}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    const gridItem = container.querySelector('[data-grid-id="1"]')
    if (gridItem) {
      // Try to drag - should be blocked
      act(() => {
        fireEvent.mouseDown(gridItem, { button: 0, clientX: 0, clientY: 0 })
      })
    }

    // No resize handles should exist
    const resizeHandles = container.querySelectorAll('[class*="cursor-"]')
    expect(resizeHandles.length).toBe(0)

    // Mouse events without active state should return early
    fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })  // Lines 144, 276
    fireEvent.mouseUp(document)  // Lines 221, 377

    expect(callbacks.onDragStart).not.toHaveBeenCalled()
    expect(callbacks.onDrag).not.toHaveBeenCalled()
    expect(callbacks.onDragStop).not.toHaveBeenCalled()
    expect(callbacks.onResizeStart).not.toHaveBeenCalled()
    expect(callbacks.onResize).not.toHaveBeenCalled()
    expect(callbacks.onResizeStop).not.toHaveBeenCalled()
  })
})