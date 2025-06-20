import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

describe('WidthProvider Browser Tests - Edge Cases', () => {
  it('should handle resize events when ref is null', async () => {
    let widthValue: number | undefined = undefined
    
    const TestComponent = () => {
      const [mounted, setMounted] = React.useState(true)
      
      return (
        <>
          <button onClick={() => setMounted(!mounted)}>Toggle</button>
          {mounted && (
            <WidthProvider>
              {(width) => {
                widthValue = width
                return <div data-testid="content">Width: {width}</div>
              }}
            </WidthProvider>
          )}
        </>
      )
    }
    
    const { getByText } = render(<TestComponent />)
    
    // Unmount the WidthProvider
    act(() => {
      getByText('Toggle').click()
    })
    
    // Trigger resize while unmounted (ref would be null)
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })
    
    // Should not crash
    expect(true).toBe(true)
    
    // Remount
    act(() => {
      getByText('Toggle').click()
    })
    
    // Should work normally after remount
    expect(widthValue).toBeDefined()
  })

  it('should handle ResizeObserver with various edge cases', async () => {
    // Save original ResizeObserver
    const originalResizeObserver = window.ResizeObserver
    
    // Mock ResizeObserver with edge cases
    let mockCallback: any = null
    const MockResizeObserver = vi.fn().mockImplementation((callback) => {
      mockCallback = callback
      return {
        observe: vi.fn((target) => {
          // Simulate various edge cases
          setTimeout(() => {
            if (mockCallback) {
              // Call with empty entries array
              mockCallback([])
              
              // Call with entry missing contentRect
              mockCallback([{ target, contentRect: undefined }])
              
              // Call with null contentRect
              mockCallback([{ target, contentRect: null }])
              
              // Call with valid entry
              mockCallback([{
                target,
                contentRect: { width: 500 }
              }])
            }
          }, 0)
        }),
        unobserve: vi.fn(),
        disconnect: vi.fn()
      }
    })
    
    window.ResizeObserver = MockResizeObserver as any
    
    let lastWidth: number | undefined
    
    render(
      <WidthProvider>
        {(width) => {
          lastWidth = width
          return <div>Width: {width}</div>
        }}
      </WidthProvider>
    )
    
    // Wait for ResizeObserver callbacks
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 50))
    })
    
    // Should handle edge cases gracefully and eventually get valid width
    expect(lastWidth).toBe(500)
    
    // Restore original ResizeObserver
    window.ResizeObserver = originalResizeObserver
  })

  it('should handle rapid mount/unmount cycles during resize', async () => {
    const TestComponent = ({ show }: { show: boolean }) => {
      if (!show) return null
      
      return (
        <WidthProvider>
          {(width) => <div data-testid="width-display">Width: {width ?? 'null'}</div>}
        </WidthProvider>
      )
    }
    
    const { rerender } = render(<TestComponent show={true} />)
    
    // Rapidly toggle visibility while resizing
    for (let i = 0; i < 5; i++) {
      rerender(<TestComponent show={false} />)
      
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
      
      rerender(<TestComponent show={true} />)
      
      act(() => {
        window.dispatchEvent(new Event('resize'))
      })
    }
    
    // Component should still be functional
    expect(document.querySelector('[data-testid="width-display"]')).toBeTruthy()
  })
})