import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { BreakpointLayouts } from '../ResponsiveGridContainer'

// Mock setTimeout and clearTimeout
vi.useFakeTimers()

describe('ResponsiveGridContainer debounce functionality', () => {
  const layouts: BreakpointLayouts = {
    lg: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }],
    md: [{ id: '1', x: 0, y: 0, w: 5, h: 2 }],
    sm: [{ id: '1', x: 0, y: 0, w: 6, h: 2 }],
  }

  beforeEach(() => {
    // Set initial window width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1400
    })
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  it('should debounce resize events', () => {
    const onBreakpointChange = vi.fn()
    
    render(
      <ResponsiveGridContainer
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Clear initial call
    onBreakpointChange.mockClear()

    // Simulate multiple resize events
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 })
      window.dispatchEvent(new Event('resize'))
      
      Object.defineProperty(window, 'innerWidth', { value: 600 })
      window.dispatchEvent(new Event('resize'))
      
      Object.defineProperty(window, 'innerWidth', { value: 500 })
      window.dispatchEvent(new Event('resize'))
    })

    // Should not have been called yet due to debounce
    expect(onBreakpointChange).not.toHaveBeenCalled()

    // Fast forward time to trigger debounced function
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Should be called once after debounce (500px falls into xs breakpoint)
    expect(onBreakpointChange).toHaveBeenCalledTimes(1)
    expect(onBreakpointChange).toHaveBeenCalledWith('xs', 4)
  })

  it('should clear timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout')
    
    const { unmount } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Trigger a resize to create a timeout
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 })
      window.dispatchEvent(new Event('resize'))
    })

    // Unmount component
    unmount()

    // Should have called clearTimeout
    expect(clearTimeoutSpy).toHaveBeenCalled()
  })

  it('should handle multiple debounced calls correctly', () => {
    const onBreakpointChange = vi.fn()
    
    render(
      <ResponsiveGridContainer
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    onBreakpointChange.mockClear()

    // First resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', { value: 800 })
      window.dispatchEvent(new Event('resize'))
    })

    // Second resize before first debounce completes
    act(() => {
      vi.advanceTimersByTime(100) // Not enough to trigger
      Object.defineProperty(window, 'innerWidth', { value: 600 })
      window.dispatchEvent(new Event('resize'))
    })

    // Complete the debounce
    act(() => {
      vi.advanceTimersByTime(150)
    })

    // Should only be called once with the latest value (600px falls into xs breakpoint)
    expect(onBreakpointChange).toHaveBeenCalledTimes(1)
    expect(onBreakpointChange).toHaveBeenCalledWith('xs', 4)
  })

  it('should not add resize listener for ResponsiveGridContainer when width prop is provided', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    addEventListenerSpy.mockClear()
    
    render(
      <ResponsiveGridContainer
        layouts={layouts}
        width={1000}
        rowHeight={100}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Check that ResponsiveGridContainer's debounced resize handler is not added
    // GridContainer may still add its own resize handler, but we're testing the debounced one
    const debouncedCalls = addEventListenerSpy.mock.calls.filter(call => 
      call[0] === 'resize' && call[1].name === 'debouncedHandleResize'
    )
    expect(debouncedCalls).toHaveLength(0)
  })
})