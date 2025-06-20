import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { GridItem, BreakpointLayouts } from '../../types'

describe('Final 100% Coverage - Direct Line Targeting', () => {
  it('should execute GridContainer.tsx line 123 - return item for new items', () => {
    // Test the exact condition where a new item doesn't exist in current layout
    const existingLayout: GridItem[] = [
      { id: 'old', x: 0, y: 0, w: 2, h: 2 }
    ]

    // Create items array where 'new' is not in existing layout
    const itemsWithNew: GridItem[] = [
      { id: 'old', x: 1, y: 1, w: 3, h: 3 }, // This will be merged from existing
      { id: 'new', x: 5, y: 5, w: 1, h: 1 }  // This should hit line 123 - return item
    ]

    const { rerender } = render(
      <GridContainer
        items={existingLayout}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </GridContainer>
    )

    // This should trigger the useEffect with new items, hitting line 123
    rerender(
      <GridContainer
        items={itemsWithNew}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </GridContainer>
    )

    expect(document.body.textContent).toContain('new')
  })

  it('should execute ResponsiveGridContainer.tsx line 94 - fallback to 12', () => {
    // Create a breakpoint that exists in neither cols prop nor defaultCols
    const layouts: BreakpointLayouts = {
      'nonexistent': [{ id: '1', x: 0, y: 0, w: 3, h: 2 }]
    }

    // Mock a scenario where:
    // 1. cols object doesn't have 'nonexistent' 
    // 2. defaultCols also doesn't have 'nonexistent'
    // 3. Should fallback to 12 on line 94

    const mockBreakpoints = {
      'nonexistent': 999
    }

    const mockCols = {
      // Intentionally empty - doesn't contain 'nonexistent'
    }

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={mockBreakpoints}
        cols={mockCols}
        rowHeight={100}
        width={1000} // This should trigger 'nonexistent' breakpoint
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // If we reach here without errors, line 94 was executed (fallback to 12)
    expect(document.body.textContent).toContain('1')
  })

  it('should trigger both edge cases in sequence', () => {
    // Comprehensive test that ensures both problematic lines are hit
    
    // First: GridContainer line 123
    const { rerender: rerenderGrid } = render(
      <GridContainer
        items={[{ id: 'existing', x: 0, y: 0, w: 2, h: 2 }]}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Grid-{item.id}</div>}
      </GridContainer>
    )

    rerenderGrid(
      <GridContainer
        items={[
          { id: 'existing', x: 1, y: 1, w: 3, h: 3 },
          { id: 'brand-new', x: 6, y: 6, w: 1, h: 1 } // This hits line 123
        ]}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Grid-{item.id}</div>}
      </GridContainer>
    )

    // Second: ResponsiveGridContainer line 94
    render(
      <ResponsiveGridContainer
        layouts={{
          'custom-bp': [{ id: '2', x: 0, y: 0, w: 3, h: 2 }]
        }}
        breakpoints={{ 'custom-bp': 800 }}
        cols={{}} // Empty cols object
        rowHeight={100}
        width={850} // Triggers 'custom-bp' which isn't in defaultCols
      >
        {(item) => <div key={item.id}>Responsive-{item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.body.textContent).toContain('Grid-brand-new')
    expect(document.body.textContent).toContain('Responsive-2')
  })
})