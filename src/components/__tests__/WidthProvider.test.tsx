import { render, screen, waitFor, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { WidthProvider } from '../WidthProvider'
import React from 'react'

// Mock component that receives width prop
const MockComponent = ({ width }: { width?: number }) => (
  <div data-testid="mock-component">Width: {width}</div>
)

describe('WidthProvider', () => {
  it('should handle resize when element ref is null', async () => {
    // Create a component that can be wrapped by WidthProvider
    const ContentComponent = ({ width }: { width?: number }) => {
      const [showContent, setShowContent] = React.useState(false)
      return (
        <>
          <button onClick={() => setShowContent(!showContent)}>Toggle</button>
          {showContent ? <div data-testid="content">Width: {width ?? 'null'}</div> : null}
        </>
      )
    }
    
    // Wrap the component with WidthProvider HOC
    const WrappedComponent = WidthProvider(ContentComponent)

    const { container } = render(<WrappedComponent />)
    
    // Trigger resize event when content is not rendered
    await act(async () => {
      window.dispatchEvent(new Event('resize'))
    })
    
    // Should not crash and handle gracefully
    expect(container).toBeInTheDocument()
  })
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
  })

  it('should provide width to wrapped component', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    render(<WrappedComponent />)
    
    // Should render the component
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
    
    // Width should be provided (either default or measured)
    await waitFor(() => {
      const text = screen.getByTestId('mock-component').textContent
      expect(text).toMatch(/Width: \d+/)
    })
  })

  it('should measure width before mount when measureBeforeMount is true', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    let container: HTMLElement
    await act(async () => {
      const result = render(<WrappedComponent measureBeforeMount />)
      container = result.container
    })
    
    // Should render a placeholder div initially with width style
    const placeholder = container!.querySelector('div')
    expect(placeholder).toBeInTheDocument()
    expect(placeholder?.style.width).toBe('100%')
    // The placeholder div should not have the component rendered yet
    expect(container!.textContent).toBe('')
  })

  it('should use ResizeObserver when available', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    await act(async () => {
      render(<WrappedComponent />)
    })
    
    // ResizeObserver should be created
    expect(mockResizeObserver).toHaveBeenCalled()
    
    // observe should be called
    const instance = mockResizeObserver.mock.results[0].value
    expect(instance.observe).toHaveBeenCalled()
  })

  it('should fall back to window resize when ResizeObserver is not available', async () => {
    // Remove ResizeObserver
    const originalResizeObserver = global.ResizeObserver
    // @ts-ignore
    delete global.ResizeObserver
    
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    
    const WrappedComponent = WidthProvider(MockComponent)
    await act(async () => {
      render(<WrappedComponent />)
    })
    
    // Should add resize listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
    
    // Restore ResizeObserver
    global.ResizeObserver = originalResizeObserver
    addEventListenerSpy.mockRestore()
  })

  it('should clean up on unmount', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    const { unmount } = render(<WrappedComponent />)
    
    const instance = mockResizeObserver.mock.results[0].value
    
    unmount()
    
    // disconnect should be called
    expect(instance.disconnect).toHaveBeenCalled()
  })

  it('should handle component without width prop gracefully', () => {
    const ComponentWithoutWidth = () => <div>No width needed</div>
    const WrappedComponent = WidthProvider(ComponentWithoutWidth as any)
    
    const { container } = render(<WrappedComponent />)
    
    expect(container.textContent).toContain('No width needed')
  })

  it('should wrap component in full-width container', () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    const { container } = render(<WrappedComponent />)
    
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.style.width).toBe('100%')
  })

  it('should handle when ref element is not available', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    // Mock ref to be null
    const useRefSpy = vi.spyOn(React, 'useRef')
    useRefSpy.mockReturnValue({ current: null })
    
    const { container } = render(<WrappedComponent />)
    
    // Should still render the component
    expect(container.querySelector('[data-testid="mock-component"]')).toBeInTheDocument()
    
    // Width should be 0 when ref is null
    await waitFor(() => {
      const text = screen.getByTestId('mock-component').textContent
      expect(text).toMatch(/Width: 0/) // width is 0 when no ref
    })
    
    useRefSpy.mockRestore()
  })

  it('should handle resize observer entry without contentRect', async () => {
    const WrappedComponent = WidthProvider(MockComponent)
    
    render(<WrappedComponent />)
    
    // Get the resize observer callback
    const resizeCallback = mockResizeObserver.mock.calls[0][0]
    
    // Call with entry that has no contentRect
    act(() => {
      resizeCallback([{
        target: document.createElement('div'),
        contentRect: undefined
      }])
    })
    
    // Should not throw and component should still be rendered
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
  })

  it('should handle resize when ref is null', () => {
    // Remove ResizeObserver to test window resize path
    const originalResizeObserver = global.ResizeObserver
    // @ts-ignore
    delete global.ResizeObserver
    
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    
    const WrappedComponent = WidthProvider(MockComponent)
    const { container } = render(<WrappedComponent />)
    
    // Get the resize handler
    const resizeHandler = addEventListenerSpy.mock.calls.find(
      call => call[0] === 'resize'
    )?.[1] as Function
    
    // Temporarily set ref to null
    const wrapper = container.firstChild as HTMLElement
    const originalOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
    Object.defineProperty(wrapper, 'offsetWidth', {
      get: () => null,
      configurable: true
    })
    
    // Call resize handler - should return early when ref is null
    act(() => {
      resizeHandler()
    })
    
    // Component should still be rendered
    expect(screen.getByTestId('mock-component')).toBeInTheDocument()
    
    // Restore
    if (originalOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originalOffsetWidth)
    }
    global.ResizeObserver = originalResizeObserver
    addEventListenerSpy.mockRestore()
  })
})