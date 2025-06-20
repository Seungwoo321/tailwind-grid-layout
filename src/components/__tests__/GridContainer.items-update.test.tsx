import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer items prop update', () => {
  it('should update layout when items prop changes', () => {
    const initialItems: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]

    const updatedItems: GridItem[] = [
      { id: '1', x: 1, y: 1, w: 3, h: 3 },
      { id: '2', x: 0, y: 0, w: 1, h: 1 }
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

    // Check initial item (use text content instead of data-id)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.queryByText('Item 2')).not.toBeInTheDocument()

    // Update items prop
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

    // Check both items are now present
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })
})