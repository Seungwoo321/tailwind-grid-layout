import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

// Mock timers
vi.useFakeTimers()

describe('Exact 100% - Target Line 94', () => {
  beforeEach(() => {
    vi.clearAllTimers()
  })


  it('should hit line 94 via initial breakpoint calculation', () => {
    const layouts: BreakpointLayouts = {
      'super': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }]
    }

    const onBreakpointChange = vi.fn()

    // Mock window width to initially trigger our custom breakpoint
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 2500
    })

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'super': 2000 }}
        cols={{}} // Empty - no fallback in cols
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should be called on mount with fallback value
    expect(onBreakpointChange).toHaveBeenCalledWith('super', 12)
  })

  it('should definitely hit the fallback with explicit width', () => {
    const layouts: BreakpointLayouts = {
      'ultimate': [{ id: '1', x: 0, y: 0, w: 1, h: 1 }]
    }

    const onBreakpointChange = vi.fn()

    render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={{ 'ultimate': 4000 }}
        cols={{}} // Completely empty cols object  
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
        width={4500} // Explicit width that triggers 'ultimate'
      >
        {(item) => <div key={item.id}>{item.id}</div>}
      </ResponsiveGridContainer>
    )

    // 'ultimate' doesn't exist in defaultCols, must fallback to 12
    expect(onBreakpointChange).toHaveBeenCalledWith('ultimate', 12)
  })
})