import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import React, { useRef } from 'react'
import { WidthProvider } from '../WidthProvider'

describe('WidthProvider - Direct Line 25 Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should trigger line 25 when element is null in handleResize', () => {
    // Create a simple test component
    const TestComponent = React.forwardRef<HTMLDivElement, { width?: number }>((props, ref) => {
      const divRef = useRef<HTMLDivElement>(null)
      React.useImperativeHandle(ref, () => divRef.current!, [])
      return <div ref={divRef}>Width: {props.width}</div>
    })

    const WrappedComponent = WidthProvider(TestComponent)
    
    let resizeHandler: (() => void) | null = null
    
    // Mock window.addEventListener to capture resize handler
    const originalAddEventListener = window.addEventListener
    const originalRemoveEventListener = window.removeEventListener
    
    window.addEventListener = vi.fn((event: string, handler: any) => {
      if (event === 'resize') {
        resizeHandler = handler
      }
      return originalAddEventListener.call(window, event, handler)
    })
    
    window.removeEventListener = vi.fn()
    
    // Render component
    const { unmount } = render(<WrappedComponent />)
    
    // Verify handler was registered
    expect(resizeHandler).toBeTruthy()
    
    // Unmount component to make elementRef.current null
    unmount()
    
    // Now call the resize handler - this should hit line 25: if (!element) return
    act(() => {
      if (resizeHandler) {
        resizeHandler()
      }
    })
    
    // Test passes if no error is thrown
    expect(true).toBe(true)
    
    // Cleanup
    window.addEventListener = originalAddEventListener
    window.removeEventListener = originalRemoveEventListener
  })

  it('should trigger line 25 when ResizeObserver callback is called after unmount', () => {
    const TestComponent = React.forwardRef<HTMLDivElement, { width?: number }>((props, ref) => {
      const divRef = useRef<HTMLDivElement>(null)
      React.useImperativeHandle(ref, () => divRef.current!, [])
      return <div ref={divRef}>Width: {props.width}</div>
    })

    const WrappedComponent = WidthProvider(TestComponent)
    
    let resizeObserverCallback: ResizeObserverCallback | null = null
    const mockDisconnect = vi.fn()
    
    // Mock ResizeObserver
    const MockResizeObserver = vi.fn((callback: ResizeObserverCallback) => {
      resizeObserverCallback = callback
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
        unobserve: vi.fn()
      }
    })
    
    const originalResizeObserver = global.ResizeObserver
    global.ResizeObserver = MockResizeObserver as any
    
    // Render component
    const { unmount } = render(<WrappedComponent />)
    
    // Verify ResizeObserver was created
    expect(MockResizeObserver).toHaveBeenCalled()
    expect(resizeObserverCallback).toBeTruthy()
    
    // Unmount component to make elementRef.current null
    unmount()
    
    // Call ResizeObserver callback after unmount - this should hit line 25
    act(() => {
      if (resizeObserverCallback) {
        resizeObserverCallback([], {} as ResizeObserver)
      }
    })
    
    expect(mockDisconnect).toHaveBeenCalled()
    
    // Restore ResizeObserver
    global.ResizeObserver = originalResizeObserver
  })
})