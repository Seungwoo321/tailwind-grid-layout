import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - isExternalDragging prop', () => {
  const mockItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

  const droppingItem = { w: 3, h: 2 }

  it('should not show dropping preview when isExternalDragging is false', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        isExternalDragging={false}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Should not find "Drop here" text
    expect(screen.queryByText('Drop here')).not.toBeInTheDocument()
  })

  it('should show dropping preview when isExternalDragging is true', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        isExternalDragging={true}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Should find "Drop here" text
    expect(screen.getByText('Drop here')).toBeInTheDocument()
  })

  it('should not show dropping preview without droppingItem even if isExternalDragging is true', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={undefined}
        isExternalDragging={true}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Should not find "Drop here" text
    expect(screen.queryByText('Drop here')).not.toBeInTheDocument()
  })

  it('should not show dropping preview when only droppingItem is provided (backward compatibility)', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        // isExternalDragging defaults to false
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    // Should not find "Drop here" text
    expect(screen.queryByText('Drop here')).not.toBeInTheDocument()
  })

  it('should apply correct styles to dropping preview', () => {
    const { container } = render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        isExternalDragging={true}
        containerPadding={[20, 20]}
        rowHeight={60}
        gap={10}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    const dropPreview = screen.getByText('Drop here').parentElement
    expect(dropPreview).toHaveClass('absolute', 'bg-gray-200', 'border-2', 'border-dashed', 'border-gray-400')
    expect(dropPreview).toHaveClass('rounded', 'opacity-75', 'pointer-events-none')
    expect(dropPreview).toHaveClass('flex', 'items-center', 'justify-center')

    // Check inline styles
    const style = window.getComputedStyle(dropPreview!)
    expect(style.left).toBe('20px') // containerPadding[0]
    expect(style.top).toBe('20px') // containerPadding[1]
  })

  it('should work correctly with autoSize enabled', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        isExternalDragging={true}
        autoSize={true}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    expect(screen.getByText('Drop here')).toBeInTheDocument()
  })

  it('should work correctly with autoSize disabled', () => {
    render(
      <GridContainer
        items={mockItems}
        droppingItem={droppingItem}
        isExternalDragging={true}
        autoSize={false}
        style={{ height: '500px' }}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )

    expect(screen.getByText('Drop here')).toBeInTheDocument()
  })
})