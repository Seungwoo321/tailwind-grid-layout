import { describe, it, expect } from 'vitest'
import { moveItems } from '../grid'
import type { GridItem } from '../../types'

describe('Grid Utilities - Horizontal Swap Coverage', () => {
  it('should swap items when moving horizontally (lines 252-257)', () => {
    const layout: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]
    
    // Move item 1 to the right past the center of item 2
    // Item 1 center will be at x=3 (past item 2's center at x=3)
    const movingItem: GridItem = { id: '1', x: 2.5, y: 0, w: 2, h: 2 }
    const originalItem: GridItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
    
    const result = moveItems(layout, movingItem, 12, originalItem)
    
    // Item 2 should swap to item 1's original position
    const item2 = result.find(i => i.id === '2')
    expect(item2?.x).toBe(0)
    expect(item2?.y).toBe(0)
  })

  it('should not swap items when shouldSwapItems returns false', () => {
    const layout: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]
    
    // Small horizontal movement that shouldn't trigger swap
    const movingItem: GridItem = { id: '1', x: 1, y: 0, w: 2, h: 2 }
    const originalItem: GridItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
    
    const result = moveItems(layout, movingItem, 12, originalItem)
    
    // Item 2 should stay in its original position
    const item2 = result.find(i => i.id === '2')
    expect(item2?.x).toBe(2)
    expect(item2?.y).toBe(0)
  })

  it('should handle horizontal movement to the left with swap', () => {
    const layout: GridItem[] = [
      { id: '1', x: 4, y: 0, w: 2, h: 2 },
      { id: '2', x: 1, y: 0, w: 2, h: 2 }
    ]
    
    // Move item 1 to the left past the center of item 2
    // Item 1 center will be at x=1.5 (less than item 2's center at x=2)
    const movingItem: GridItem = { id: '1', x: 0.5, y: 0, w: 2, h: 2 }
    const originalItem: GridItem = { id: '1', x: 4, y: 0, w: 2, h: 2 }
    
    const result = moveItems(layout, movingItem, 12, originalItem)
    
    // Item 2 should swap to item 1's original position
    const item2 = result.find(i => i.id === '2')
    expect(item2?.x).toBe(4)
    expect(item2?.y).toBe(0)
  })
})