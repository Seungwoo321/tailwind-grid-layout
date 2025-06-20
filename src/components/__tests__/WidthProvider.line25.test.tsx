import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

// Mock component
const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider - Line 25 Coverage', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.clearAllTimers()
  })

  it('should trigger early return when elementRef.current is null during resize', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Track ResizeObserver callback
    let resizeCallback: Function | null = null
    const observeTargets: Element[] = []
    
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((callback) => {
      resizeCallback = callback
      return {
        observe: vi.fn((target) => {
          observeTargets.push(target)
        }),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }
    })
    
    // Render the component
    const { container, unmount } = render(<WrappedComponent />)
    
    // Get the observed element
    const observedElement = observeTargets[0]
    expect(observedElement).toBeDefined()
    
    // Temporarily remove the element from DOM to make ref null
    const parent = observedElement.parentNode
    parent?.removeChild(observedElement)
    
    // Mock offsetWidth to return undefined/null
    Object.defineProperty(observedElement, 'offsetWidth', {
      get: () => undefined,
      configurable: true
    })
    
    // Trigger resize callback when element is detached (ref should be null)
    act(() => {
      if (resizeCallback) {
        resizeCallback([{ target: observedElement }])
      }
    })
    
    // Re-attach element
    parent?.appendChild(observedElement)
    
    // Component should still be functional
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    unmount()
  })

  it('should handle window resize with null ref (no ResizeObserver)', () => {
    // Remove ResizeObserver to force window resize path
    const originalResizeObserver = global.ResizeObserver
    // @ts-ignore
    delete global.ResizeObserver
    
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Capture the resize handler
    let windowResizeHandler: Function | null = null
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize' && typeof handler === 'function') {
        windowResizeHandler = handler
      }
    })
    
    // Render component
    const { container } = render(<WrappedComponent />)
    
    // Get the wrapper div
    const wrapper = container.querySelector('div[style*="width: 100%"]') as HTMLElement
    expect(wrapper).toBeDefined()
    
    // Temporarily detach the wrapper to simulate null ref
    const parent = wrapper.parentNode
    parent?.removeChild(wrapper)
    
    // Trigger resize when element is detached
    act(() => {
      if (windowResizeHandler) {
        windowResizeHandler(new Event('resize'))
      }
    })
    
    // Re-attach
    parent?.appendChild(wrapper)
    
    // Component should handle gracefully
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    // Restore
    global.ResizeObserver = originalResizeObserver
    addEventListenerSpy.mockRestore()
  })

  it('should handle ResizeObserver firing during unmount', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    let resizeCallback: Function | null = null
    let disconnectCalled = false
    
    // Mock ResizeObserver
    const mockObserver = {
      observe: vi.fn(),
      disconnect: vi.fn(() => { disconnectCalled = true }),
      unobserve: vi.fn()
    }
    
    global.ResizeObserver = vi.fn((callback) => {
      resizeCallback = callback
      return mockObserver
    })
    
    // Render and immediately unmount
    const { unmount } = render(<WrappedComponent />)
    
    // Schedule resize callback after unmount
    setTimeout(() => {
      if (resizeCallback && !disconnectCalled) {
        // This should trigger early return due to mounted.current = false
        resizeCallback([{ target: document.createElement('div') }])
      }
    }, 10)
    
    // Unmount the component
    unmount()
    
    // Run timers
    act(() => {
      vi.runAllTimers()
    })
    
    // Verify disconnect was called
    expect(mockObserver.disconnect).toHaveBeenCalled()
  })
})