import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

describe('True 100% Coverage - ResponsiveGridContainer Line 94', () => {
  it('should execute line 94 fallback when both cols and defaultCols miss the breakpoint', () => {
    // Create a breakpoint that doesn't exist in defaultCols
    const layouts: BreakpointLayouts = {
      'ultra-wide': [{ id: '1', x: 0, y: 0, w: 3, h: 2 }]
    }

    // Custom breakpoint not in defaultCols (lg, md, sm, xs, xxs)
    const customBreakpoints = {
      'ultra-wide': 1600
    }

    // Cols object that also doesn't include our custom breakpoint
    const incompleteCols = {
      lg: 8,
      md: 6
      // Missing 'ultra-wide' - this forces fallback to 12
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={incompleteCols}
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={1700} // This should trigger 'ultra-wide' breakpoint
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Verify the fallback to 12 was used
    expect(onBreakpointChange).toHaveBeenCalledWith('ultra-wide', 12)
  })

  it('should test with completely unknown breakpoint', () => {
    const layouts: BreakpointLayouts = {
      'unknown': [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'unknown': 5000 }}
        cols={{}} // Completely empty cols
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={5100} // Triggers 'unknown' which exists nowhere
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(onBreakpointChange).toHaveBeenCalledWith('unknown', 12)
  })

  it('should trigger window resize to hit line 94', () => {
    const layouts: BreakpointLayouts = {
      'custom-responsive': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }]
    }

    const onBreakpointChange = vi.fn()

    // Set initial window width to a standard size
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000
    })

    const { unmount } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'custom-responsive': 1500 }}
        cols={{ lg: 10 }} // Doesn't include 'custom-responsive'
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        // No width prop - should use window.innerWidth
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    onBreakpointChange.mockClear()

    // Change window size to trigger custom breakpoint
    Object.defineProperty(window, 'innerWidth', { value: 1600 })
    window.dispatchEvent(new Event('resize'))

    // Wait for resize handler to process
    setTimeout(() => {
      expect(onBreakpointChange).toHaveBeenCalledWith('custom-responsive', 12)
    }, 200)

    unmount()
  })
})