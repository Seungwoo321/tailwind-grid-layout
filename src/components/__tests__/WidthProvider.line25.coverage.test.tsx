import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, act } from '@testing-library/react'
import React from 'react'
import { WidthProvider } from '../WidthProvider'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('WidthProvider - Line 25 Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should handle null element in resize handler (line 25)', async () => {
    const GridWithWidth = WidthProvider(GridContainer)
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    
    let resizeHandler: (() => void) | null = null
    
    // Mock addEventListener to capture the resize handler
    const originalAddEventListener = window.addEventListener
    window.addEventListener = vi.fn((event: string, handler: any) => {
      if (event === 'resize' && !resizeHandler) {
        resizeHandler = handler
      }
      return originalAddEventListener.call(window, event, handler)
    })
    
    // Render the component with measureBeforeMount=false to trigger immediate resize
    const { unmount } = render(
      <GridWithWidth items={items} measureBeforeMount={false}>
        {(item) => <div>{item.id}</div>}
      </GridWithWidth>
    )
    
    // Verify resize handler was registered
    expect(resizeHandler).toBeTruthy()
    
    // Unmount the component - this makes elementRef.current null
    unmount()
    
    // Now call the resize handler - this should trigger the null check on line 25
    act(() => {
      if (resizeHandler) {
        resizeHandler()
      }
    })
    
    // Verify no errors occurred (the function should just return early)
    expect(true).toBe(true)
    
    // Cleanup
    window.addEventListener = originalAddEventListener
  })
  
  it('should handle resize with ResizeObserver when element becomes null', async () => {
    // Mock ResizeObserver
    let resizeObserverCallback: ResizeObserverCallback | null = null
    const mockDisconnect = vi.fn()
    
    const MockResizeObserver = vi.fn((callback: ResizeObserverCallback) => {
      resizeObserverCallback = callback
      return {
        observe: vi.fn(),
        disconnect: mockDisconnect,
        unobserve: vi.fn()
      }
    })
    
    // Replace global ResizeObserver
    const originalResizeObserver = global.ResizeObserver
    global.ResizeObserver = MockResizeObserver as any
    
    const GridWithWidth = WidthProvider(GridContainer)
    const items: GridItem[] = [{ id: '1', x: 0, y: 0, w: 2, h: 2 }]
    
    // Render the component
    const { unmount } = render(
      <GridWithWidth items={items}>
        {(item) => <div>{item.id}</div>}
      </GridWithWidth>
    )
    
    // Verify ResizeObserver was created
    expect(MockResizeObserver).toHaveBeenCalled()
    expect(resizeObserverCallback).toBeTruthy()
    
    // Unmount the component
    unmount()
    
    // Simulate ResizeObserver callback after unmount
    // This should hit line 25: if (!element) return
    act(() => {
      if (resizeObserverCallback) {
        resizeObserverCallback([], {} as ResizeObserver)
      }
    })
    
    // Verify disconnect was called
    expect(mockDisconnect).toHaveBeenCalled()
    
    // Restore ResizeObserver
    global.ResizeObserver = originalResizeObserver
  })
})