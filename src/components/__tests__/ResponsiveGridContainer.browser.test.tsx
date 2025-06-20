import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { GridLayouts } from '../../types'

describe('ResponsiveGridContainer Browser Tests - Edge Cases', () => {
  const mockLayouts: GridLayouts = {
    lg: [{ id: '1', x: 0, y: 0, w: 4, h: 2 }],
    md: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
    sm: [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
  }

  it('should handle breakpoints object edge cases', () => {
    const onBreakpointChange = vi.fn()
    
    // Test with completely custom breakpoints not in defaultCols
    const customBreakpoints = {
      huge: 2000,
      big: 1500,
      medium: 1000,
      small: 500,
      tiny: 300
    }
    
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts}
        width={1100}
        breakpoints={customBreakpoints}
        cols={{ huge: 30, big: 24 }} // Missing medium, small, tiny
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )
    
    // Should use fallback of 12 for 'medium' breakpoint
    expect(onBreakpointChange).toHaveBeenCalledWith('medium', 12)
  })

  it('should handle empty breakpoints array', () => {
    const onBreakpointChange = vi.fn()
    
    // Test with empty breakpoints - should trigger defensive code
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts}
        width={1200}
        breakpoints={{}}
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )
    
    // Should default to 'lg' with default cols
    expect(onBreakpointChange).toHaveBeenCalledWith('lg', 12)
  })

  it('should handle malformed breakpoints gracefully', () => {
    const onBreakpointChange = vi.fn()
    
    // Test with unusual breakpoint values
    const weirdBreakpoints = {
      a: 0,
      b: -100,
      c: Infinity,
      d: NaN
    }
    
    const { container } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts}
        width={800}
        breakpoints={weirdBreakpoints as any}
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )
    
    // Should still render without crashing
    expect(container.querySelector('[data-grid-id="1"]')).toBeTruthy()
  })
})