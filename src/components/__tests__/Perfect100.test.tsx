import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

describe('Perfect 100% Coverage - Line 94', () => {
  it('should execute line 94 fallback with custom breakpoint not in defaultCols', () => {
    // The key insight: getBreakpoint can only return breakpoints defined in the breakpoints prop
    // So we need a breakpoint that is:
    // 1. Defined in breakpoints prop
    // 2. NOT in defaultCols (lg, md, sm, xs, xxs)
    // 3. NOT in cols prop (or cols prop doesn't have it)
    
    const layouts: BreakpointLayouts = {
      'custom-4k': [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'custom-4k': 2560 }} // Custom breakpoint not in defaultCols
        cols={{}} // Empty cols object - doesn't contain 'custom-4k'
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={2600} // Width triggers 'custom-4k' breakpoint
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // This should trigger line 94: || 12 fallback
    // Because:
    // - cols['custom-4k'] is undefined (falsy)
    // - defaultCols['custom-4k'] is undefined (falsy)  
    // - So it falls back to 12
    expect(onBreakpointChange).toHaveBeenCalledWith('custom-4k', 12)
  })

  it('should hit line 94 with breakpoint not in either cols or defaultCols', () => {
    // Another angle: use a breakpoint name that definitely doesn't exist in defaultCols
    const layouts: BreakpointLayouts = {
      'ultra-wide-monitor': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }]
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'ultra-wide-monitor': 3440 }}
        cols={{ lg: 8 }} // Has lg but not 'ultra-wide-monitor'
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={3500} // Triggers 'ultra-wide-monitor'
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(onBreakpointChange).toHaveBeenCalledWith('ultra-wide-monitor', 12)
  })

  it('should trigger line 94 with minimal breakpoints setup', () => {
    // Simplest case: just one custom breakpoint
    const layouts: BreakpointLayouts = {
      'minimal': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }]
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'minimal': 800 }}
        // No cols prop at all - uses defaultCols, but 'minimal' isn't in defaultCols
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={900}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(onBreakpointChange).toHaveBeenCalledWith('minimal', 12)
  })
})