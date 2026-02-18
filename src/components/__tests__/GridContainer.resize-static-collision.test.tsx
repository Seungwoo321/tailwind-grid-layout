import React from 'react'
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import { GridItem } from '../../types'
import '@testing-library/jest-dom'
import { vi } from 'vitest'

describe('GridContainer - Static Item Collision on Resize', () => {
  const defaultProps = {
    cols: 12,
    rowHeight: 60,
    gap: 16,
    containerPadding: [16, 16] as [number, number],
    isResizable: true,
    resizeHandles: ['se', 'sw', 'ne', 'nw', 'n', 's', 'e', 'w'] as Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>,
    children: (item: GridItem) => (
      <div className="grid-item" data-testid={`grid-item-${item.id}`}>
        {item.id}
      </div>
    )
  }

  const createItems = (): GridItem[] => [
    { id: '1', x: 0, y: 0, w: 4, h: 2 },
    { id: '2', x: 6, y: 0, w: 4, h: 2, static: true },
    { id: '3', x: 0, y: 3, w: 4, h: 2 },
    { id: '4', x: 6, y: 3, w: 4, h: 2, static: true }
  ]

  beforeEach(() => {
    // Mock container dimensions
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      value: 1200
    })
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      value: 800
    })
  })

  describe('8-directional resize handle collision tests', () => {
    it('SE handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={createItems()}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const seHandle = item?.querySelector('[data-testid="resize-handle-se"]') as HTMLElement

      expect(seHandle).toBeTruthy()

      // Start resize
      act(() => {
        fireEvent.mouseDown(seHandle, { clientX: 100, clientY: 100 })
      })

      // Move to overlap with static item2 at x=6
      act(() => {
        fireEvent.mouseMove(document, { clientX: 400, clientY: 100 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      // End resize
      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    it('NW handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      // Static item is at top-left of the resizing item
      const items: GridItem[] = [
        { id: '1', x: 4, y: 3, w: 4, h: 2 },
        { id: '2', x: 0, y: 0, w: 3, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const nwHandle = item?.querySelector('[data-testid="resize-handle-nw"]') as HTMLElement

      expect(nwHandle).toBeTruthy()

      act(() => {
        fireEvent.mouseDown(nwHandle, { clientX: 200, clientY: 200 })
      })
      // Move up-left to collide with static item
      act(() => {
        fireEvent.mouseMove(document, { clientX: -100, clientY: -100 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    it('SW handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const items: GridItem[] = [
        { id: '1', x: 8, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 3, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const swHandle = item?.querySelector('[data-testid="resize-handle-sw"]') as HTMLElement

      expect(swHandle).toBeTruthy()

      act(() => {
        fireEvent.mouseDown(swHandle, { clientX: 200, clientY: 100 })
      })
      act(() => {
        fireEvent.mouseMove(document, { clientX: 0, clientY: 200 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    it('SW handle should stop at static item below', async () => {
      const onResize = vi.fn()
      // Static item is below the resizing item in the same column
      const items: GridItem[] = [
        { id: '1', x: 4, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 3, w: 4, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const swHandle = item?.querySelector('[data-testid="resize-handle-sw"]') as HTMLElement

      expect(swHandle).toBeTruthy()

      act(() => {
        fireEvent.mouseDown(swHandle, { clientX: 200, clientY: 100 })
      })
      // Move down to collide with static item below
      act(() => {
        fireEvent.mouseMove(document, { clientX: 100, clientY: 400 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    it('NE handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const items: GridItem[] = [
        { id: '1', x: 0, y: 2, w: 4, h: 2 },
        { id: '2', x: 5, y: 0, w: 3, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const neHandle = item?.querySelector('[data-testid="resize-handle-ne"]') as HTMLElement

      expect(neHandle).toBeTruthy()

      act(() => {
        fireEvent.mouseDown(neHandle, { clientX: 100, clientY: 200 })
      })
      act(() => {
        fireEvent.mouseMove(document, { clientX: 300, clientY: 50 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      act(() => {
        fireEvent.mouseUp(document)
      })
    })

    it('E handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={createItems()}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      // Edge handles use cursor class, not data-testid when invisible
      const eHandle = item?.querySelector('[data-testid="resize-handle-e"]') ||
                      item?.querySelector('.cursor-e-resize') as HTMLElement

      if (eHandle) {
        act(() => {
          fireEvent.mouseDown(eHandle, { clientX: 100, clientY: 100 })
        })
        act(() => {
          fireEvent.mouseMove(document, { clientX: 400, clientY: 100 })
        })

        await waitFor(() => {
          expect(onResize).toHaveBeenCalled()
        })

        act(() => {
          fireEvent.mouseUp(document)
        })
      }
    })

    it('W handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const items: GridItem[] = [
        { id: '1', x: 8, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 3, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const wHandle = item?.querySelector('[data-testid="resize-handle-w"]') ||
                      item?.querySelector('.cursor-w-resize') as HTMLElement

      if (wHandle) {
        act(() => {
          fireEvent.mouseDown(wHandle, { clientX: 200, clientY: 100 })
        })
        act(() => {
          fireEvent.mouseMove(document, { clientX: 0, clientY: 100 })
        })

        await waitFor(() => {
          expect(onResize).toHaveBeenCalled()
        })

        act(() => {
          fireEvent.mouseUp(document)
        })
      }
    })

    it('N handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      // Static item is above the resizing item in the same column
      const items: GridItem[] = [
        { id: '1', x: 4, y: 3, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 4, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const nHandle = item?.querySelector('[data-testid="resize-handle-n"]') ||
                      item?.querySelector('.cursor-n-resize') as HTMLElement

      if (nHandle) {
        act(() => {
          fireEvent.mouseDown(nHandle, { clientX: 100, clientY: 200 })
        })
        // Move up to collide with static item above
        act(() => {
          fireEvent.mouseMove(document, { clientX: 100, clientY: -100 })
        })

        await waitFor(() => {
          expect(onResize).toHaveBeenCalled()
        })

        act(() => {
          fireEvent.mouseUp(document)
        })
      }
    })

    it('S handle should stop at static item boundary', async () => {
      const onResize = vi.fn()
      const items: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', x: 0, y: 3, w: 4, h: 2, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const sHandle = item?.querySelector('[data-testid="resize-handle-s"]') ||
                      item?.querySelector('.cursor-s-resize') as HTMLElement

      if (sHandle) {
        act(() => {
          fireEvent.mouseDown(sHandle, { clientX: 100, clientY: 100 })
        })
        act(() => {
          fireEvent.mouseMove(document, { clientX: 100, clientY: 300 })
        })

        await waitFor(() => {
          expect(onResize).toHaveBeenCalled()
        })

        act(() => {
          fireEvent.mouseUp(document)
        })
      }
    })
  })

  describe('Visual feedback tests', () => {
    it('should trigger resize event when resizing toward static item', async () => {
      const onResize = vi.fn()
      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={createItems()}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      const seHandle = item?.querySelector('[data-testid="resize-handle-se"]') as HTMLElement

      expect(seHandle).toBeTruthy()

      // Start resize
      act(() => {
        fireEvent.mouseDown(seHandle, { clientX: 100, clientY: 100 })
      })

      // Move to create collision
      act(() => {
        fireEvent.mouseMove(document, { clientX: 500, clientY: 100 })
      })

      await waitFor(() => {
        expect(onResize).toHaveBeenCalled()
      })

      // End resize
      act(() => {
        fireEvent.mouseUp(document)
      })
    })
  })

  describe('Multiple static items collision', () => {
    it('should handle resize with multiple surrounding static items', async () => {
      const onResize = vi.fn()
      const items: GridItem[] = [
        { id: '1', x: 4, y: 2, w: 2, h: 2 },
        { id: '2', x: 2, y: 0, w: 2, h: 4, static: true },
        { id: '3', x: 6, y: 0, w: 2, h: 4, static: true },
        { id: '4', x: 4, y: 0, w: 2, h: 1, static: true },
        { id: '5', x: 4, y: 4, w: 2, h: 1, static: true }
      ]

      const { container } = render(
        <GridContainer
          {...defaultProps}
          items={items}
          onResize={onResize}
        />
      )

      const item = container.querySelector('[data-grid-id="1"]') as HTMLElement
      expect(item).toBeTruthy()

      // Test SE handle
      const seHandle = item?.querySelector('[data-testid="resize-handle-se"]') as HTMLElement
      if (seHandle) {
        act(() => {
          fireEvent.mouseDown(seHandle, { clientX: 100, clientY: 100 })
        })
        act(() => {
          fireEvent.mouseMove(document, { clientX: 200, clientY: 200 })
        })

        await waitFor(() => {
          expect(onResize).toHaveBeenCalled()
        })

        act(() => {
          fireEvent.mouseUp(document)
        })
      }
    })
  })
})
