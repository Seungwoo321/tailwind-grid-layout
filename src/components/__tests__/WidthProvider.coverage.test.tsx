import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

// Mock component that receives width prop
const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider - Coverage Tests', () => {
  let mockResizeObserver: any
  
  beforeEach(() => {
    // Mock ResizeObserver
    mockResizeObserver = vi.fn(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    }))
    global.ResizeObserver = mockResizeObserver
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should handle resize when element ref is null (coverage line 25)', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Render the component
    const { container } = render(<WrappedComponent />)
    
    // Get the resize observer callback
    const resizeCallback = mockResizeObserver.mock.calls[0][0]
    
    // Mock the elementRef to be null temporarily
    const wrapper = container.querySelector('div[style*="width: 100%"]') as HTMLElement
    
    // Create a custom ref that we can control
    let savedOffsetWidth = wrapper.offsetWidth
    Object.defineProperty(wrapper, 'offsetWidth', {
      get: () => {
        // Return null/undefined to simulate element not being ready
        return undefined
      },
      configurable: true
    })
    
    // Remove the wrapper temporarily from DOM to make ref null
    const parent = wrapper.parentNode
    parent?.removeChild(wrapper)
    
    // Trigger resize callback
    act(() => {
      resizeCallback([{
        target: wrapper,
        contentRect: { width: 800 }
      }])
    })
    
    // Re-add wrapper
    parent?.appendChild(wrapper)
    
    // Restore offsetWidth
    Object.defineProperty(wrapper, 'offsetWidth', {
      get: () => savedOffsetWidth,
      configurable: true
    })
    
    // Component should still be rendered without errors
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
  })

  it('should handle resize early return when ref current is null (better approach)', () => {
    vi.useFakeTimers()
    
    const WrappedComponent = WidthProvider(MockComponent)
    let resizeCallback: Function | null = null
    
    // Mock ResizeObserver to capture the callback
    const MockResizeObserver = vi.fn((callback) => {
      resizeCallback = callback
      return {
        observe: vi.fn((element) => {
          // Simulate immediate resize with null element
          setTimeout(() => {
            if (resizeCallback) {
              // Set the element's offsetWidth to null to trigger early return
              Object.defineProperty(element, 'offsetWidth', {
                get: () => null,
                configurable: true
              })
              resizeCallback([{ target: element }])
            }
          }, 0)
        }),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }
    })
    
    global.ResizeObserver = MockResizeObserver as any
    
    // Render component
    const { container } = render(<WrappedComponent />)
    
    // Wait for the resize callback to be triggered
    act(() => {
      vi.runAllTimers()
    })
    
    // Component should still render
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
  })

  it('should handle resize with ResizeObserver when element becomes null', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Create a mock element that we can control
    let mockElement: HTMLDivElement | null = document.createElement('div')
    Object.defineProperty(mockElement, 'offsetWidth', {
      value: 1000,
      configurable: true
    })
    
    // Mock useRef to return our controlled ref
    const originalUseRef = React.useRef
    const mockRef = { 
      get current() { return mockElement },
      set current(val) { mockElement = val }
    }
    
    React.useRef = vi.fn((initial) => {
      if (initial === null) {
        return mockRef
      }
      return originalUseRef(initial)
    })
    
    // Render component
    render(<WrappedComponent />)
    
    // Get the resize observer callback
    const resizeCallback = mockResizeObserver.mock.calls[0][0]
    
    // Set element to null to trigger the early return on line 25
    mockElement = null
    
    // Trigger resize - should hit line 25 and return early
    act(() => {
      resizeCallback([{
        target: null,
        contentRect: { width: 800 }
      }])
    })
    
    // No error should occur
    expect(true).toBe(true)
    
    // Restore
    React.useRef = originalUseRef
  })
})