import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import { GridItem } from '../../types'

describe('GridContainer preserveInitialHeight', () => {
  const defaultItems: GridItem[] = [
    { id: 'item1', x: 0, y: 0, w: 3, h: 2 },
    { id: 'item2', x: 3, y: 0, w: 3, h: 3 }, // maxRow = 3
    { id: 'item3', x: 0, y: 2, w: 3, h: 2 }, // y + h = 4 (최대)
  ]

  const defaultProps = {
    items: defaultItems,
    cols: 12,
    rowHeight: 60,
    gap: 16,
    containerPadding: [16, 16] as [number, number],
    children: (item: GridItem) => <div data-testid={`item-${item.id}`}>{item.id}</div>,
  }

  it('should not set height/minHeight when preserveInitialHeight is false and autoSize is false', () => {
    const { container } = render(<GridContainer {...defaultProps} autoSize={false} />)
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // Without autoSize and preserveInitialHeight, no height styles should be set
    expect(gridContainer.style.height).toBe('')
    expect(gridContainer.style.minHeight).toBe('')
  })

  it('should use fixed height (not minHeight) when preserveInitialHeight is true and autoSize is false', () => {
    const { container } = render(
      <GridContainer {...defaultProps} preserveInitialHeight={true} autoSize={false} />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // maxRow = 4 (from item3: y=2, h=2)
    // Height calculation: maxRow * (rowHeight + gap) + padding
    // = 4 * (60 + 16) + 32 = 4 * 76 + 32 = 304 + 32 = 336px
    const expectedHeight = 4 * (60 + 16) + 16 * 2

    // Should use height (not minHeight) to enable scroll behavior
    expect(gridContainer.style.height).toBe(`${expectedHeight}px`)
    expect(gridContainer.style.minHeight).toBe('')
  })

  it('should preserve initial height even when layout changes', () => {
    const { container, rerender } = render(
      <GridContainer {...defaultProps} preserveInitialHeight={true} autoSize={false} />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement
    const initialHeight = gridContainer.style.height

    // Change items to smaller layout
    const smallerItems: GridItem[] = [
      { id: 'item1', x: 0, y: 0, w: 3, h: 1 }, // maxRow now = 1
    ]

    rerender(
      <GridContainer {...defaultProps} items={smallerItems} preserveInitialHeight={true} autoSize={false} />
    )

    // height should still be the initial height
    expect(gridContainer.style.height).toBe(initialHeight)
  })

  it('should allow style prop to override height', () => {
    const { container } = render(
      <GridContainer
        {...defaultProps}
        preserveInitialHeight={true}
        autoSize={false}
        style={{ height: '500px' }}
      />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // style prop should override calculated height
    expect(gridContainer.style.height).toBe('500px')
  })

  it('should use minHeight when both preserveInitialHeight and autoSize are enabled', () => {
    // Items that create a larger height than initial
    const tallItems: GridItem[] = [
      { id: 'item1', x: 0, y: 0, w: 3, h: 6 }, // y + h = 6
    ]

    const { container } = render(
      <GridContainer
        {...defaultProps}
        items={tallItems}
        preserveInitialHeight={true}
        autoSize={true}
      />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // Height calculation: (y + h) * (rowHeight + gap) = 6 * (60 + 16) = 456
    // With padding: 456 + 32 = 488px
    const expectedHeight = 6 * (60 + 16) + 16 * 2

    // With autoSize=true, should use minHeight (container can grow)
    expect(gridContainer.style.minHeight).toBe(`${expectedHeight}px`)
    expect(gridContainer.style.height).toBe('')
  })

  it('should work with different rowHeight and gap values', () => {
    const items: GridItem[] = [
      { id: 'item1', x: 0, y: 0, w: 3, h: 2 }, // y + h = 2
    ]

    const { container } = render(
      <GridContainer
        items={items}
        cols={12}
        rowHeight={100}
        gap={20}
        containerPadding={[10, 10] as [number, number]}
        preserveInitialHeight={true}
        autoSize={false}
        children={(item: GridItem) => <div>{item.id}</div>}
      />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // maxRow = 2
    // height = 2 * (100 + 20) + 10 * 2 = 2 * 120 + 20 = 240 + 20 = 260px
    expect(gridContainer.style.height).toBe('260px')
  })

  it('should work with margin prop instead of gap', () => {
    const items: GridItem[] = [
      { id: 'item1', x: 0, y: 0, w: 3, h: 3 }, // y + h = 3
    ]

    const { container } = render(
      <GridContainer
        items={items}
        cols={12}
        rowHeight={60}
        gap={16}
        margin={[10, 20] as [number, number]} // vertical margin = 20
        containerPadding={[16, 16] as [number, number]}
        preserveInitialHeight={true}
        autoSize={false}
        children={(item: GridItem) => <div>{item.id}</div>}
      />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // maxRow = 3
    // height = 3 * (60 + 20) + 16 * 2 = 3 * 80 + 32 = 240 + 32 = 272px
    expect(gridContainer.style.height).toBe('272px')
  })

  it('should handle empty items array', () => {
    const { container } = render(
      <GridContainer
        items={[]}
        cols={12}
        rowHeight={60}
        gap={16}
        containerPadding={[16, 16] as [number, number]}
        preserveInitialHeight={true}
        autoSize={false}
        children={(item: GridItem) => <div>{item.id}</div>}
      />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // Empty items = height 0 + padding = 32px
    expect(gridContainer.style.height).toBe('32px')
  })

  it('should enable scroll when content exceeds fixed height', () => {
    const { container } = render(
      <GridContainer {...defaultProps} preserveInitialHeight={true} autoSize={false} />
    )
    const gridContainer = container.querySelector('.tailwind-grid-layout') as HTMLElement

    // Container should have overflow-auto class for scroll
    expect(gridContainer.classList.contains('overflow-auto')).toBe(true)

    // Container should have fixed height (not minHeight)
    expect(gridContainer.style.height).not.toBe('')
    expect(gridContainer.style.minHeight).toBe('')
  })
})
