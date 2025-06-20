import { describe, it, expect, vi } from 'vitest'
import { render, act } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { GridItem, BreakpointLayouts } from '../../types'

describe('Final 100% Coverage', () => {
  it('should hit line 123 in GridContainer - new items keep original position', () => {
    const initialItems: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]

    const updatedItems: GridItem[] = [
      { id: '2', x: 5, y: 5, w: 1, h: 1 } // Completely new item
    ]

    const { rerender } = render(
      <GridContainer
        items={initialItems}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    // This rerender should trigger the code path where new items keep their original position
    rerender(
      <GridContainer
        items={updatedItems}
        cols={12}
        rowHeight={100}
        gap={10}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </GridContainer>
    )

    expect(document.body.textContent).toContain('Item 2')
  })

  it('should hit line 94 in ResponsiveGridContainer - fallback to 12 columns', () => {
    const layouts: BreakpointLayouts = {
      ultrawide: [{ id: '1', x: 0, y: 0, w: 3, h: 2 }]
    }

    const customBreakpoints = {
      ultrawide: 2000
    }

    // Create a mock object for cols that doesn't have ultrawide
    const incompleteCols = {
      lg: 12,
      md: 10
      // Missing 'ultrawide' key
    }

    const onBreakpointChange = vi.fn()

    // Set window width to trigger ultrawide breakpoint
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 2100
    })

    const { unmount } = render(
      <ResponsiveGridContainer
        layouts={layouts}
        breakpoints={customBreakpoints}
        cols={incompleteCols}
        rowHeight={100}
        onBreakpointChange={onBreakpointChange}
      >
        {(item) => <div key={item.id}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // This should trigger the fallback to 12 columns on line 94
    act(() => {
      window.dispatchEvent(new Event('resize'))
    })

    // Check that it falls back to 12 columns when neither cols object nor defaultCols has the breakpoint
    expect(onBreakpointChange).toHaveBeenCalledWith('ultrawide', 12)

    unmount()
  })
})