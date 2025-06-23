import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { GridItem, BreakpointLayouts } from '../../types'

describe('Absolute 100% Coverage - Target Specific Lines', () => {
  it('should execute GridContainer line 123 - new item return path', () => {
    // Start with one item
    const initialItems: GridItem[] = [
      { id: 'existing', x: 1, y: 1, w: 2, h: 2 }
    ]

    const { rerender } = render(
      <GridContainer
        items={initialItems}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </GridContainer>
    )

    // Add a completely new item - this should trigger the useEffect logic
    // that includes the equivalent of line 123
    const itemsWithNewItem: GridItem[] = [
      { id: 'existing', x: 1, y: 1, w: 2, h: 2 }, // Keep existing
      { id: 'totally-new-item', x: 5, y: 5, w: 1, h: 1 } // This should hit the "return item" path
    ]

    rerender(
      <GridContainer
        items={itemsWithNewItem}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </GridContainer>
    )

    expect(document.body.textContent).toContain('totally-new-item')
  })

  it('should execute ResponsiveGridContainer line 94 - 12 fallback', () => {
    // Use a breakpoint that doesn't exist in defaultCols
    const layouts: BreakpointLayouts = {
      'super-custom': [{ id: '1', x: 0, y: 0, w: 3, h: 2 }]
    }

    // Define breakpoints with our custom one
    const customBreakpoints = {
      'super-custom': 2000 // Very high breakpoint
    }

    // Provide cols that also doesn't have this breakpoint
    const limitedCols = {
      lg: 10
      // Missing 'super-custom' - should fallback to 12
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={limitedCols}
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={2100} // This triggers 'super-custom' breakpoint
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should have called with fallback value of 12
    expect(onBreakpointChange).toHaveBeenCalledWith('super-custom', 12)
  })

  it('should test both edge cases together', () => {
    // Test 1: GridContainer new item path
    const { rerender: rerenderGrid } = render(
      <GridContainer
        items={[{ id: 'old', x: 0, y: 0, w: 1, h: 1 }]}
        cols={6}
        rowHeight={50}
      >
        {(item) => <div key={item.id}>Grid-{item.id}</div>}
      </GridContainer>
    )

    // Add new item
    rerenderGrid(
      <GridContainer
        items={[
          { id: 'old', x: 0, y: 0, w: 1, h: 1 },
          { id: 'new', x: 2, y: 2, w: 1, h: 1 }
        ]}
        cols={6}
        rowHeight={50}
      >
        {(item) => <div key={item.id}>Grid-{item.id}</div>}
      </GridContainer>
    )

    // Test 2: ResponsiveGridContainer fallback
    const onBreakpointChange = vi.fn()
    render(
      <ResponsiveGridContainer
        layouts={{
          'unique-bp': [{ id: '2', x: 0, y: 0, w: 2, h: 2 }]
        }}
        breakpoints={{ 'unique-bp': 1800 }}
        cols={{}} // Empty cols - should use fallback
        onBreakpointChange={onBreakpointChange}
        rowHeight={80}
        width={1900} // Triggers unique-bp
      >
        {(item) => <div key={item.id}>Resp-{item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.body.textContent).toContain('Grid-new')
    expect(document.body.textContent).toContain('Resp-2')
    expect(onBreakpointChange).toHaveBeenCalledWith('unique-bp', 12)
  })
})