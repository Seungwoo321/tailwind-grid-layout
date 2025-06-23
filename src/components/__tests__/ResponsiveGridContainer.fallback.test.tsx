import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

describe('ResponsiveGridContainer fallback functionality', () => {
  it('should fallback to default columns when breakpoint not found in cols', () => {
    const layouts: BreakpointLayouts = {
      xxl: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }], // Custom breakpoint not in default cols
    }

    const customBreakpoints = {
      xxl: 1600, // Custom breakpoint
    }

    // Don't provide cols prop, should fallback to default and then to 12
    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        rowHeight={100}
        width={1700} // Should trigger xxl breakpoint
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Component should render without error, using fallback columns (12)
    expect(document.body.textContent).toContain('Item 1')
  })

  it('should use default cols when cols object does not have the breakpoint', () => {
    const layouts: BreakpointLayouts = {
      custom: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
    }

    const customBreakpoints = {
      custom: 1000,
    }

    const customCols = {
      // Intentionally missing 'custom' breakpoint
      lg: 12,
    }

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={customCols}
        rowHeight={100}
        width={1100} // Should trigger custom breakpoint
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should render without error using fallback
    expect(document.body.textContent).toContain('Item 1')
  })

  it('should fallback to 12 columns when both cols object and default cols do not have breakpoint', () => {
    const layouts: BreakpointLayouts = {
      unknown: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
      lg: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
    }

    const customBreakpoints = {
      unknown: 500,
      lg: 1200,
    }

    const onBreakpointChange = vi.fn()

    // Start with lg breakpoint
    const { rerender } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={{}} // Empty cols object
        rowHeight={100}
        width={1300} // Initially trigger lg breakpoint
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Clear previous calls
    onBreakpointChange.mockClear()

    // Now change width to trigger unknown breakpoint
    rerender(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={{}} // Empty cols object
        rowHeight={100}
        width={600} // Should trigger unknown breakpoint
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should render without error using final fallback (12)
    expect(document.body.textContent).toContain('Item 1')
    // Should call onBreakpointChange with fallback value
    expect(onBreakpointChange).toHaveBeenCalledWith('unknown', 12)
  })
})