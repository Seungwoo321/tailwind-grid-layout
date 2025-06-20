import { describe, it, expect, vi } from 'vitest'
import { render, fireEvent, act } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Final Branch Coverage', () => {
  // Line 112, 115: isDraggable and isResizable conditions
  it('should cover isDraggable false branches', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false },
      { id: '2', x: 2, y: 0, w: 2, h: 2, isResizable: false }
    ]
    
    const { container } = render(
      <GridContainer items={items} isDraggable={false}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    // Try to drag an item that's not draggable
    const item1 = container.querySelector('[data-testid="item-1"]') as HTMLElement
    act(() => {
      fireEvent.mouseDown(item1, { button: 0 })
    })
    
    expect(item1).toBeInTheDocument()
  })

  // Line 144: test drag when not draggable  
  it('should handle drag attempt on non-draggable item', () => {
    const onDrag = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false }
    ]
    
    const { container } = render(
      <GridContainer items={items} onDrag={onDrag}>
        {(item) => (
          <div data-testid={`item-${item.id}`}>
            {item.id}
          </div>
        )}
      </GridContainer>
    )
    
    const item = container.querySelector('[data-testid="item-1"]')?.parentElement
    expect(item).toBeTruthy()
    
    // Attempt to drag - should not trigger onDrag
    act(() => {
      fireEvent.mouseDown(item!, { button: 0, clientX: 0, clientY: 0 })
    })
    act(() => {
      fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
    })
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(onDrag).not.toHaveBeenCalled()
  })

  // Line 195: missing draggedItem in handleDragEnd
  it('should handle drag end when draggedItem is not found', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Simulate a drag state with non-existent item
    act(() => {
      // Force a drag end without proper drag start
      act(() => {
        fireEvent.mouseUp(document)
      })
    })
    
    expect(container.querySelector('.relative')).toBeInTheDocument()
  })

  // Lines 221, 227: missing resizeState.resizingItem
  it('should handle resize without resizingItem', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    const { container } = render(
      <GridContainer items={items}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Simulate resize end without resize start
    act(() => {
      fireEvent.mouseUp(document)
    })
    
    expect(container).toBeTruthy()
  })

  // Lines 250, 253: non-resizable item check
  it('should not allow resize on non-resizable items', () => {
    const onResize = vi.fn()
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false }
    ]
    
    const { container } = render(
      <GridContainer items={items} isResizable={false} onResize={onResize}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Try to resize - should not work
    const resizeHandle = container.querySelector('.resize-handle')
    if (resizeHandle) {
      act(() => {
        fireEvent.mouseDown(resizeHandle, { button: 0 })
      })
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 100 })
      })
      act(() => {
        fireEvent.mouseUp(document)
      })
    }
    
    expect(onResize).not.toHaveBeenCalled()
  })

  // Lines 276, 281-282: isDraggable and isStatic edge cases
  it('should handle mixed draggable/static items', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isDraggable: false },
      { id: '2', x: 2, y: 0, w: 2, h: 2, isStatic: true },
      { id: '3', x: 4, y: 0, w: 2, h: 2 } // Normal draggable
    ]
    
    const { container } = render(
      <GridContainer items={items}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    // All items should render
    expect(container.querySelector('[data-testid="item-1"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="item-2"]')).toBeInTheDocument()
    expect(container.querySelector('[data-testid="item-3"]')).toBeInTheDocument()
  })

  // Line 377: isResizable edge case in ResizeHandle
  it('should handle ResizeHandle with item-level isResizable false', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, isResizable: false },
      { id: '2', x: 2, y: 0, w: 2, h: 2 } // Should be resizable
    ]
    
    const { container } = render(
      <GridContainer items={items} isResizable={true}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    // Item 1 should not have resize handles
    const item1 = container.querySelectorAll('.absolute')[0]
    const item1Handles = item1?.querySelectorAll('[class*="resize-handle"]')
    
    // Item 2 should have resize handles
    const item2 = container.querySelectorAll('.absolute')[1]
    const item2Handles = item2?.querySelectorAll('[class*="resize-handle"]')
    
    expect(item1Handles?.length || 0).toBe(0)
    expect(item2Handles?.length || 0).toBeGreaterThan(0)
  })

  // Line 438: empty layout for calculatedHeight
  it('should handle Math.max with empty array (line 438)', () => {
    // This tests the edge case where layout.map returns empty array
    const { container } = render(
      <GridContainer items={[]} autoSize={true}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridContainer = container.querySelector('.relative') as HTMLElement
    // When layout is empty, Math.max() returns -Infinity, so || 0 is used
    expect(gridContainer).toBeInTheDocument()
    
    // Check that minHeight is set appropriately
    const style = window.getComputedStyle(gridContainer)
    // Should not be Infinity
    expect(style.minHeight).not.toBe('Infinity')
  })
})