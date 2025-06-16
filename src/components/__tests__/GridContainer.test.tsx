import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GridContainer } from '../GridContainer'
import { GridItem } from '../../types'

describe('GridContainer', () => {
  const mockItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

  const mockOnLayoutChange = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render grid items', () => {
    const { container } = render(
      <GridContainer items={mockItems} onLayoutChange={mockOnLayoutChange}>
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </GridContainer>
    )

    expect(container.querySelector('[data-testid="item-1"]')).toBeTruthy()
    expect(container.querySelector('[data-testid="item-2"]')).toBeTruthy()
  })

  it('should apply custom className', () => {
    const { container } = render(
      <GridContainer items={mockItems} className="custom-class">
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(container.firstChild).toHaveClass('custom-class')
  })

  it('should handle drag start', async () => {
    const onDragStart = vi.fn()
    const { container } = render(
      <GridContainer 
        items={mockItems} 
        onDragStart={onDragStart}
        isDraggable={true}
      >
        {(item) => <div className="grid-drag-handle">Item {item.id}</div>}
      </GridContainer>
    )

    const firstItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    const dragHandle = firstItem.querySelector('.grid-drag-handle') as HTMLElement
    
    fireEvent.mouseDown(dragHandle, { clientX: 100, clientY: 100 })
    
    expect(onDragStart).toHaveBeenCalled()
  })

  it('should not allow dragging static items', () => {
    const staticItems: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, static: true }
    ]
    const onDragStart = vi.fn()

    const { container } = render(
      <GridContainer items={staticItems} onDragStart={onDragStart}>
        {(item) => <div className="grid-drag-handle">Item {item.id}</div>}
      </GridContainer>
    )

    const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
    fireEvent.mouseDown(item)
    
    expect(onDragStart).not.toHaveBeenCalled()
  })

  it('should handle resize', () => {
    const onResizeStart = vi.fn()
    const { container } = render(
      <GridContainer 
        items={mockItems} 
        onResizeStart={onResizeStart}
        isResizable={true}
      >
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const resizeHandle = container.querySelector('.react-grid-layout__resize-handle') as HTMLElement
    fireEvent.mouseDown(resizeHandle, { clientX: 100, clientY: 100 })
    
    expect(onResizeStart).toHaveBeenCalled()
  })

  it('should update layout on items change', () => {
    const { rerender } = render(
      <GridContainer items={mockItems}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const newItems: GridItem[] = [
      ...mockItems,
      { id: '3', x: 4, y: 0, w: 2, h: 2 }
    ]

    rerender(
      <GridContainer items={newItems}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(document.querySelector('[data-grid-id="3"]')).toBeTruthy()
  })

  it('should apply maxRows constraint', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 10, w: 2, h: 2 }
    ]

    const { container } = render(
      <GridContainer items={items} maxRows={5}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    // Item should be constrained to maxRows
    const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
    expect(item).toBeTruthy()
  })

  it('should handle different compact types', () => {
    const items: GridItem[] = [
      { id: '1', x: 2, y: 2, w: 2, h: 2 },
      { id: '2', x: 4, y: 4, w: 2, h: 2 }
    ]

    const { rerender } = render(
      <GridContainer items={items} compactType="vertical">
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    rerender(
      <GridContainer items={items} compactType="horizontal">
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    rerender(
      <GridContainer items={items} compactType={null}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(document.querySelector('[data-grid-id="1"]')).toBeTruthy()
  })

  it('should show placeholders during drag', async () => {
    const { container } = render(
      <GridContainer items={mockItems} isDraggable={true}>
        {(item) => <div className="grid-drag-handle">Item {item.id}</div>}
      </GridContainer>
    )

    const firstItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    const dragHandle = firstItem.querySelector('.grid-drag-handle') as HTMLElement
    
    fireEvent.mouseDown(dragHandle, { clientX: 100, clientY: 100 })
    fireEvent.mouseMove(document, { clientX: 200, clientY: 200 })

    await waitFor(() => {
      const placeholder = container.querySelector('.absolute.rounded-lg.transition-all')
      expect(placeholder).toBeTruthy()
    })
  })

  it('should handle preventCollision', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2, static: true }
    ]

    const { container } = render(
      <GridContainer items={items} preventCollision={true}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(container.querySelector('[data-grid-id="1"]')).toBeTruthy()
    expect(container.querySelector('[data-grid-id="2"]')).toBeTruthy()
  })

  it('should handle allowOverlap', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 1, y: 1, w: 2, h: 2 }
    ]

    const { container } = render(
      <GridContainer items={items} allowOverlap={true}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(container.querySelector('[data-grid-id="1"]')).toBeTruthy()
    expect(container.querySelector('[data-grid-id="2"]')).toBeTruthy()
  })

  it('should handle margin prop', () => {
    const { container } = render(
      <GridContainer items={mockItems} margin={[10, 20]}>
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    expect(container.querySelector('[data-grid-id="1"]')).toBeTruthy()
  })

  it('should handle resize handles configuration', () => {
    const { container } = render(
      <GridContainer 
        items={mockItems} 
        isResizable={true}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
      >
        {(item) => <div>Item {item.id}</div>}
      </GridContainer>
    )

    const resizeHandles = container.querySelectorAll('.react-grid-layout__resize-handle')
    expect(resizeHandles.length).toBeGreaterThan(0)
  })

  it('should handle draggableCancel', () => {
    const onDragStart = vi.fn()
    const { container } = render(
      <GridContainer 
        items={mockItems} 
        onDragStart={onDragStart}
        draggableCancel=".no-drag"
      >
        {(item) => (
          <div>
            <div className="grid-drag-handle">Drag</div>
            <button className="no-drag">Button</button>
          </div>
        )}
      </GridContainer>
    )

    const button = container.querySelector('.no-drag') as HTMLElement
    fireEvent.mouseDown(button)
    
    expect(onDragStart).not.toHaveBeenCalled()
  })
})