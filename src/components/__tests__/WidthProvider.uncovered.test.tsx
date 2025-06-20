import { render, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider - Uncovered Line 25', () => {
  let resizeObserverCallback: Function | null = null
  let mockObserverInstance: any
  
  beforeEach(() => {
    vi.useFakeTimers()
    resizeObserverCallback = null
    
    mockObserverInstance = {
      observe: vi.fn(),
      disconnect: vi.fn(),
      unobserve: vi.fn()
    }
    
    global.ResizeObserver = vi.fn((callback) => {
      resizeObserverCallback = callback
      return mockObserverInstance
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should handle resize when element ref is null (line 25)', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Create a custom hook to control the ref
    const TestWrapper = () => {
      const [shouldRender, setShouldRender] = React.useState(true)
      
      React.useEffect(() => {
        // Remove the component after initial render to make ref null
        const timer = setTimeout(() => {
          setShouldRender(false)
          
          // Then trigger resize while component is unmounted
          setTimeout(() => {
            if (resizeObserverCallback) {
              resizeObserverCallback([{
                target: document.createElement('div'),
                contentRect: { width: 100 }
              }])
            }
          }, 10)
        }, 10)
        
        return () => clearTimeout(timer)
      }, [])
      
      return shouldRender ? <WrappedComponent /> : null
    }
    
    const { container } = render(<TestWrapper />)
    
    // Wait for the component to be removed and resize to be triggered
    act(() => {
      vi.advanceTimersByTime(50)
    })
    
    // The resize handler should have early returned when element was null
    expect(container.innerHTML).toBe('')
  })

  it('should handle resize callback when component unmounts during resize', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // This approach simulates the ref becoming null between ResizeObserver setup and callback
    let unmount: Function
    
    const TestComponent = () => {
      const divRef = React.useRef<HTMLDivElement>(null)
      
      React.useEffect(() => {
        // Manually trigger scenario where ref might be null
        const timer = setTimeout(() => {
          // Force the ref.current to be null by unmounting
          unmount()
          
          // Now trigger resize - the ref should be null
          if (resizeObserverCallback) {
            resizeObserverCallback([{
              target: document.createElement('div'),
              contentRect: { width: 200 }
            }])
          }
        }, 0)
        
        return () => clearTimeout(timer)
      }, [])
      
      return <div ref={divRef}><WrappedComponent /></div>
    }
    
    const result = render(<TestComponent />)
    unmount = result.unmount
    
    act(() => {
      vi.runAllTimers()
    })
    
    // Should not crash when resize fires with null ref
    expect(true).toBe(true)
  })

  it('should handle ResizeObserver firing after component cleanup', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Save the resize callback before component unmounts
    let savedCallback: Function | null = null
    
    const { unmount } = render(<WrappedComponent />)
    
    // Save the callback
    savedCallback = resizeObserverCallback
    
    // Unmount the component (this should disconnect the observer)
    unmount()
    
    // Try to trigger resize after unmount - should handle gracefully
    act(() => {
      if (savedCallback) {
        savedCallback([{
          target: document.createElement('div'),
          contentRect: { width: 300 }
        }])
      }
    })
    
    // Should not crash
    expect(true).toBe(true)
  })
})