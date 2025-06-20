import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@vitest/browser/context'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer Browser Tests - Edge Cases', () => {
  it('should handle drag operations with corrupted internal state', async () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 3, y: 0, w: 2, h: 2 }
    ]
    
    const onDrag = vi.fn()
    
    const { container } = render(
      <GridContainer 
        items={items} 
        onDrag={onDrag}
        isDraggable={true}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {(item) => (
          <div className="grid-drag-handle" style={{ cursor: 'move', padding: '10px' }}>
            Item {item.id}
          </div>
        )}
      </GridContainer>
    )

    const firstItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    const dragHandle = firstItem.querySelector('.grid-drag-handle') as HTMLElement
    
    // Perform complex drag operation
    await userEvent.pointer([
      { target: dragHandle, keys: '[MouseLeft>]' },
      { coords: { x: 100, y: 100 } },
      { coords: { x: 200, y: 100 } },
      { coords: { x: 300, y: 100 } },
      { keys: '[/MouseLeft]' }
    ])
    
    // Verify drag was handled
    expect(onDrag).toHaveBeenCalled()
  })

  it('should handle rapid drag state changes', async () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2, static: false },
      { id: '2', x: 3, y: 0, w: 2, h: 2, static: true }
    ]
    
    const onDrag = vi.fn()
    
    const { container } = render(
      <GridContainer 
        items={items} 
        onDrag={onDrag}
        isDraggable={true}
        preventCollision={true}
        allowOverlap={false}
        cols={12}
        rowHeight={30}
        width={1200}
      >
        {(item) => <div className="grid-drag-handle">Item {item.id}</div>}
      </GridContainer>
    )

    const firstItem = container.querySelector('[data-grid-id="1"]') as HTMLElement
    const handle = firstItem.querySelector('.grid-drag-handle') as HTMLElement
    
    // Start dragging
    await userEvent.pointer({ target: handle, keys: '[MouseLeft>]' })
    
    // Move rapidly to different positions
    for (let i = 0; i < 10; i++) {
      await userEvent.pointer({ coords: { x: 50 + i * 20, y: 50 } })
    }
    
    // End drag
    await userEvent.pointer({ keys: '[/MouseLeft]' })
    
    // The component should handle this without issues
    expect(container.querySelector('[data-grid-id="1"]')).toBeTruthy()
  })
})