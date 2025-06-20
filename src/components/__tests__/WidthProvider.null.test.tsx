import { render, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider - Null Element Coverage', () => {
  let mockResizeObserver: any
  
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.useRealTimers()
  })

  it('should handle null element in resize callback (line 25)', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    let resizeCallback: Function | null = null
    let observeCount = 0
    
    // Mock ResizeObserver
    mockResizeObserver = vi.fn((callback) => {
      resizeCallback = callback
      return {
        observe: vi.fn((element) => {
          observeCount++
          // Don't trigger callback during observe
        }),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }
    })
    
    global.ResizeObserver = mockResizeObserver
    
    // Render component
    const { container, unmount } = render(<WrappedComponent />)
    
    // Verify ResizeObserver was created
    expect(mockResizeObserver).toHaveBeenCalled()
    expect(resizeCallback).toBeDefined()
    
    // Get the container element
    const wrapperDiv = container.querySelector('div[style*="width: 100%"]') as HTMLElement
    expect(wrapperDiv).toBeDefined()
    
    // Simulate a resize event where the element reference becomes null
    // This can happen if the element is removed from DOM during resize
    act(() => {
      // Mock the element to have null offsetWidth
      Object.defineProperty(wrapperDiv, 'offsetWidth', {
        get: () => {
          // Return null to trigger early return
          return null
        },
        configurable: true
      })
      
      // Call resize callback with the element
      if (resizeCallback) {
        resizeCallback([{ target: wrapperDiv }])
      }
    })
    
    // Component should still be rendered
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    unmount()
  })

  it('should handle resize with detached DOM element', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    let resizeCallback: Function | null = null
    
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn((callback) => {
      resizeCallback = callback
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        unobserve: vi.fn()
      }
    })
    
    // Render component
    const { container } = render(<WrappedComponent />)
    
    // Get the wrapper element
    const wrapper = container.firstChild as HTMLElement
    
    // Create a detached element (not in DOM)
    const detachedElement = document.createElement('div')
    
    // Mock offsetWidth to return null
    Object.defineProperty(detachedElement, 'offsetWidth', {
      value: null,
      configurable: true
    })
    
    // Trigger resize with detached element
    act(() => {
      if (resizeCallback) {
        resizeCallback([{ target: detachedElement }])
      }
    })
    
    // Component should handle gracefully
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
  })

  it('should test window resize path with null element', () => {
    // Remove ResizeObserver to force window resize path
    const originalResizeObserver = global.ResizeObserver
    // @ts-ignore
    delete global.ResizeObserver
    
    const WrappedComponent = WidthProvider(MockComponent)
    
    let resizeHandler: Function | null = null
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {
      if (event === 'resize' && typeof handler === 'function') {
        resizeHandler = handler
      }
    })
    
    // Mock element ref
    const mockElementRef = { current: null as HTMLDivElement | null }
    const originalUseRef = React.useRef
    React.useRef = vi.fn((initial) => {
      if (initial === null) {
        return mockElementRef
      }
      return originalUseRef(initial)
    })
    
    // Render component
    const { container } = render(<WrappedComponent />)
    
    // Ensure ref is null
    mockElementRef.current = null
    
    // Trigger resize
    act(() => {
      if (resizeHandler) {
        resizeHandler(new Event('resize'))
      }
    })
    
    // Should handle gracefully
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    // Restore
    React.useRef = originalUseRef
    global.ResizeObserver = originalResizeObserver
    addEventListenerSpy.mockRestore()
  })
})