import React from 'react'
import { render, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { GridItemComponent } from '../GridItem'
import { GridItem } from '../../types'

describe('GridItemComponent', () => {
  const mockOnDragStart = vi.fn()
  const mockOnResizeStart = vi.fn()

  const defaultItem: GridItem = {
    id: '1',
    x: 0,
    y: 0,
    w: 2,
    h: 2
  }

  const defaultPosition = {
    left: 0,
    top: 0,
    width: 200,
    height: 200
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render children', () => {
    const { getByText } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test Content</div>
      </GridItemComponent>
    )

    expect(getByText('Test Content')).toBeTruthy()
  })

  it('should apply position styles', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    expect(element.style.left).toBe('0px')
    expect(element.style.top).toBe('0px')
    expect(element.style.width).toBe('200px')
    expect(element.style.height).toBe('200px')
  })

  it('should apply dragging styles', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={true}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('opacity-80', 'z-50', 'cursor-grabbing', 'shadow-2xl')
    expect(element.style.transform).toBe('scale(1.02)')
  })

  it('should apply resizing styles', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={true}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('z-40')
  })

  it('should handle drag start with drag handle', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div className="grid-drag-handle">Drag Handle</div>
      </GridItemComponent>
    )

    const dragHandle = container.querySelector('.grid-drag-handle') as HTMLElement
    act(() => {
      fireEvent.mouseDown(dragHandle)
    })
    
    expect(mockOnDragStart).toHaveBeenCalledWith('1', expect.any(Object))
  })

  it('should handle drag start without specific handle', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Content</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    act(() => {
      fireEvent.mouseDown(element)
    })
    
    expect(mockOnDragStart).toHaveBeenCalledWith('1', expect.any(Object))
  })

  it('should not allow dragging static items', () => {
    const staticItem: GridItem = { ...defaultItem, static: true }
    
    const { container } = render(
      <GridItemComponent
        item={staticItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Static Item</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    act(() => {
      fireEvent.mouseDown(element)
    })
    
    expect(mockOnDragStart).not.toHaveBeenCalled()
  })

  it('should not trigger drag on action buttons', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div className="grid-drag-handle">
          <button className="grid-actions">Action</button>
        </div>
      </GridItemComponent>
    )

    const button = container.querySelector('.grid-actions') as HTMLElement
    act(() => {
      fireEvent.mouseDown(button)
    })
    
    expect(mockOnDragStart).not.toHaveBeenCalled()
  })

  it('should respect draggableCancel', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        draggableCancel=".no-drag"
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div className="grid-drag-handle">
          <span className="no-drag">No Drag</span>
        </div>
      </GridItemComponent>
    )

    const noDragElement = container.querySelector('.no-drag') as HTMLElement
    act(() => {
      fireEvent.mouseDown(noDragElement)
    })
    
    expect(mockOnDragStart).not.toHaveBeenCalled()
  })

  it('should render resize handles when resizable', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const resizeHandles = container.querySelectorAll('.react-grid-layout__resize-handle')
    expect(resizeHandles).toHaveLength(4)
  })

  it('should not render resize handles when not resizable', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={false}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const resizeHandles = container.querySelectorAll('.react-grid-layout__resize-handle')
    expect(resizeHandles).toHaveLength(0)
  })

  it('should apply custom className', () => {
    const itemWithClass: GridItem = { ...defaultItem, className: 'custom-class' }
    
    const { container } = render(
      <GridItemComponent
        item={itemWithClass}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    expect(element).toHaveClass('custom-class')
  })

  it('should set data-grid-id attribute', () => {
    const { container } = render(
      <GridItemComponent
        item={defaultItem}
        position={defaultPosition}
        isDragging={false}
        isResizing={false}
        isDraggable={true}
        isResizable={true}
        onDragStart={mockOnDragStart}
        onResizeStart={mockOnResizeStart}
      >
        <div>Test</div>
      </GridItemComponent>
    )

    const element = container.firstChild as HTMLElement
    expect(element.getAttribute('data-grid-id')).toBe('1')
  })
})