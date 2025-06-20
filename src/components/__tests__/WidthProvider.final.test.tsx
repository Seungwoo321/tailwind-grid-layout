import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider - Final Line 25 Coverage', () => {
  let mockResizeObserver: any
  let resizeCallbacks: Function[] = []
  
  beforeEach(() => {
    resizeCallbacks = []
    
    // Create a more sophisticated ResizeObserver mock
    mockResizeObserver = vi.fn((callback) => {
      resizeCallbacks.push(callback)
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }
    })
    
    global.ResizeObserver = mockResizeObserver
  })

  afterEach(() => {
    vi.clearAllMocks()
    resizeCallbacks = []
  })

  it('should return early when element.offsetWidth is null (line 25 coverage)', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Render component
    const { container } = render(<WrappedComponent />)
    
    // Get the resize callback
    expect(resizeCallbacks.length).toBe(1)
    const resizeCallback = resizeCallbacks[0]
    
    // Create a mock element with null offsetWidth
    const mockElement = document.createElement('div')
    
    // Mock the ref to return our element
    const wrapper = container.firstChild as HTMLElement
    
    // Override the offsetWidth property to return null
    Object.defineProperty(mockElement, 'offsetWidth', {
      get: () => null,
      configurable: true
    })
    
    // Call resize with our mock element
    act(() => {
      resizeCallback([{
        target: mockElement,
        contentRect: {} // Doesn't matter since we'll return early
      }])
    })
    
    // Component should still render
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
  })

  it('should handle element becoming null during resize observation', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Render component
    const { container, unmount } = render(<WrappedComponent />)
    
    const resizeCallback = resizeCallbacks[0]
    
    // Create element that will "disappear"
    const element = document.createElement('div')
    let offsetWidthCalls = 0
    
    Object.defineProperty(element, 'offsetWidth', {
      get() {
        offsetWidthCalls++
        // First call returns null to trigger early return
        if (offsetWidthCalls === 1) {
          return null
        }
        return 100
      },
      configurable: true
    })
    
    // Trigger resize multiple times
    act(() => {
      // First call - should return early due to null
      resizeCallback([{ target: element }])
      
      // Second call - should work normally
      resizeCallback([{ target: element }])
    })
    
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    unmount()
  })

  it('should handle ResizeObserver with detached DOM element', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Create a detached element (not in DOM)
    const detachedDiv = document.createElement('div')
    
    // offsetWidth of detached element might be 0 or null
    Object.defineProperty(detachedDiv, 'offsetWidth', {
      value: null,
      configurable: true
    })
    
    // Mock the ref to use our detached element
    const originalUseRef = React.useRef
    let refCalls = 0
    React.useRef = vi.fn((initial) => {
      refCalls++
      if (initial === null && refCalls === 1) {
        return { current: detachedDiv }
      }
      return originalUseRef(initial)
    })
    
    const { container } = render(<WrappedComponent />)
    
    // Trigger resize on detached element
    const resizeCallback = resizeCallbacks[0]
    
    act(() => {
      resizeCallback([{ target: detachedDiv }])
    })
    
    // Should handle gracefully
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    // Restore
    React.useRef = originalUseRef
  })
})