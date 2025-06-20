import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

vi.useFakeTimers()

describe('Ultimate 100% Coverage - Force Line 94', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should force breakpoint change to trigger line 94', () => {
    const layouts: BreakpointLayouts = {
      'custom': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }],
      'other': [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    }

    const onBreakpointChange = vi.fn()

    // Set initial window size to trigger first breakpoint
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1000
    })

    const { unmount } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 
          'custom': 800,   // Will be triggered initially
          'other': 1200    // Will be triggered on resize
        }}
        cols={{}} // Empty cols - forces fallback to defaultCols, then to 12
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Clear initial calls
    onBreakpointChange.mockClear()

    // Now trigger a breakpoint change by resizing
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 1300 })
      window.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)
    })

    // This should trigger line 94 because:
    // 1. newBreakpoint !== currentBreakpoint (true)
    // 2. cols['other'] is undefined (falsy) 
    // 3. defaultCols['other'] is undefined (falsy)
    // 4. Falls back to 12
    expect(onBreakpointChange).toHaveBeenCalledWith('other', 12)

    unmount()
  })

  it('should hit line 94 with direct breakpoint change simulation', () => {
    const layouts: BreakpointLayouts = {
      'start': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }],
      'target': [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    }

    const onBreakpointChange = vi.fn()

    // Start with a known breakpoint
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    })

    const { unmount } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 
          'start': 400,    // Initial
          'target': 600    // Target 
        }}
        cols={{}} // No custom cols
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    onBreakpointChange.mockClear()

    // Force breakpoint change
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 700 })
      window.dispatchEvent(new Event('resize'))
      vi.advanceTimersByTime(200)
    })

    // 'target' is not in defaultCols, should use fallback 12
    expect(onBreakpointChange).toHaveBeenCalledWith('target', 12)

    unmount()
  })

})