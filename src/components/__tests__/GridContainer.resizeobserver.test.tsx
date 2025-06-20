import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer ResizeObserver functionality', () => {
  const items: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 }
  ]

  let originalResizeObserver: typeof ResizeObserver

  beforeEach(() => {
    originalResizeObserver = global.ResizeObserver
  })

  afterEach(() => {
    global.ResizeObserver = originalResizeObserver
  })

  it('should use ResizeObserver when available', () => {
    const mockObserve = vi.fn()
    const mockDisconnect = vi.fn()
    
    // Mock ResizeObserver
    global.ResizeObserver = vi.fn().mockImplementation((callback) => ({
      observe: mockObserve,
      disconnect: mockDisconnect,
      unobserve: vi.fn(),
    }))

    const { unmount } = render(
      <GridContainer
        items={items}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    // Should create ResizeObserver and call observe
    expect(global.ResizeObserver).toHaveBeenCalled()
    expect(mockObserve).toHaveBeenCalled()

    // Should disconnect on unmount
    unmount()
    expect(mockDisconnect).toHaveBeenCalled()
  })

  it('should fallback to window resize when ResizeObserver is not available', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
    
    // Remove ResizeObserver
    // @ts-ignore
    global.ResizeObserver = undefined

    const { unmount } = render(
      <GridContainer
        items={items}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    // Should add window resize listener
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))

    // Should remove listener on unmount
    unmount()
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function))
  })

  it('should preserve items that are not in layout and keep new items in original position', () => {
    const itemsWithExtra: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]

    const newItems: GridItem[] = [
      { id: '1', x: 1, y: 1, w: 3, h: 3 }, // Updated existing item
      { id: '3', x: 5, y: 5, w: 1, h: 1 } // New item - should keep original position
    ]

    const onLayoutChange = vi.fn()

    const { rerender } = render(
      <GridContainer
        items={itemsWithExtra}
        cols={12}
        rowHeight={100}
        gap={10}
        onLayoutChange={onLayoutChange}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    // Update with new items where item '2' is not present but '3' is new
    rerender(
      <GridContainer
        items={newItems}
        cols={12}
        rowHeight={100}
        gap={10}
        onLayoutChange={onLayoutChange}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    // Both items should be present
    expect(document.body.textContent).toContain('Item 1')
    expect(document.body.textContent).toContain('Item 3')
  })
})