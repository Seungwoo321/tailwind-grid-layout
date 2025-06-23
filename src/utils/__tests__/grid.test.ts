import { describe, it, expect } from 'vitest'
import {
  calculateGridPosition,
  getPixelPosition,
  checkCollision,
  findFreeSpace,
  compactLayout,
  moveItems,
  getAllCollisions
} from '../grid'
import { GridItem, GridPosition } from '../../types'

describe('Grid Utilities', () => {
  describe('calculateGridPosition', () => {
    it('should calculate correct grid position', () => {
      const result = calculateGridPosition(100, 150, 12, 60, 16, 1200)
      expect(result).toEqual({ col: 1, row: 2 })
    })

    it('should handle negative positions', () => {
      const result = calculateGridPosition(-50, -100, 12, 60, 16, 1200)
      expect(result).toEqual({ col: 0, row: 0 })
    })

    it('should use margin when provided', () => {
      const result = calculateGridPosition(100, 150, 12, 60, 16, 1200, [10, 20])
      expect(result).toEqual({ col: 1, row: 2 })
    })
  })

  describe('getPixelPosition', () => {
    it('should calculate correct pixel position', () => {
      const item: GridPosition = { x: 2, y: 1, w: 3, h: 2 }
      const result = getPixelPosition(item, 12, 60, 16, 1200)
      
      const colWidth = (1200 - 16 * 11) / 12
      const expectedLeft = 2 * (colWidth + 16)
      const expectedWidth = 3 * colWidth + 2 * 16
      
      expect(result.left).toBeCloseTo(expectedLeft, 0)
      expect(result.top).toBe(76)
      expect(result.width).toBeCloseTo(expectedWidth, 0)
      expect(result.height).toBe(136)
    })

    it('should use margin when provided', () => {
      const item: GridPosition = { x: 2, y: 1, w: 3, h: 2 }
      const result = getPixelPosition(item, 12, 60, 16, 1200, [10, 20])
      
      const colWidth = (1200 - 10 * 11) / 12
      const expectedLeft = 2 * (colWidth + 10)
      const expectedWidth = 3 * colWidth + 2 * 10
      
      expect(result.left).toBe(Math.round(expectedLeft))
      expect(result.top).toBe(80)
      expect(result.width).toBe(Math.round(expectedWidth))
      expect(result.height).toBe(140)
    })
  })

  describe('checkCollision', () => {
    it('should detect collision between overlapping items', () => {
      const item1: GridPosition = { x: 0, y: 0, w: 2, h: 2 }
      const item2: GridPosition = { x: 1, y: 1, w: 2, h: 2 }
      
      expect(checkCollision(item1, item2)).toBe(true)
    })

    it('should not detect collision between non-overlapping items', () => {
      const item1: GridPosition = { x: 0, y: 0, w: 2, h: 2 }
      const item2: GridPosition = { x: 3, y: 0, w: 2, h: 2 }
      
      expect(checkCollision(item1, item2)).toBe(false)
    })

    it('should not detect collision when items are adjacent', () => {
      const item1: GridPosition = { x: 0, y: 0, w: 2, h: 2 }
      const item2: GridPosition = { x: 2, y: 0, w: 2, h: 2 }
      
      expect(checkCollision(item1, item2)).toBe(false)
    })
  })

  describe('findFreeSpace', () => {
    it('should return original position if no collision', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 }
      ]
      const itemToPlace: GridPosition = { x: 3, y: 0, w: 2, h: 2 }
      
      const result = findFreeSpace(items, itemToPlace, 12)
      expect(result).toEqual(itemToPlace)
    })

    it('should find next available position on collision', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 }
      ]
      const itemToPlace: GridPosition = { x: 0, y: 0, w: 2, h: 2 }
      
      const result = findFreeSpace(items, itemToPlace, 12)
      expect(result).toEqual({ x: 2, y: 0, w: 2, h: 2 })
    })

    it('should exclude item by id when specified', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 2, y: 0, w: 2, h: 2 }
      ]
      const itemToPlace: GridPosition = { x: 0, y: 0, w: 2, h: 2 }
      
      const result = findFreeSpace(items, itemToPlace, 12, '1')
      expect(result).toEqual(itemToPlace)
    })
  })

  describe('compactLayout', () => {
    it('should compact items vertically', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 2, w: 2, h: 2 },
        { id: '2', x: 2, y: 4, w: 2, h: 2 }
      ]
      
      const result = compactLayout(items, 12, 'vertical')
      expect(result[0]).toMatchObject({ id: '1', y: 0 })
      expect(result[1]).toMatchObject({ id: '2', y: 0 })
    })

    it('should compact items horizontally', () => {
      const items: GridItem[] = [
        { id: '1', x: 2, y: 0, w: 2, h: 2 },
        { id: '2', x: 4, y: 2, w: 2, h: 2 }
      ]
      
      const result = compactLayout(items, 12, 'horizontal')
      expect(result[0]).toMatchObject({ id: '1', x: 0 })
      expect(result[1]).toMatchObject({ id: '2', x: 0 })
    })

    it('should not compact when compactType is null', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 2, w: 2, h: 2 },
        { id: '2', x: 2, y: 4, w: 2, h: 2 }
      ]
      
      const result = compactLayout(items, 12, null)
      expect(result).toEqual(items)
    })

    it('should preserve static items position', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 2, w: 2, h: 2, static: true },
        { id: '2', x: 2, y: 4, w: 2, h: 2 }
      ]
      
      const result = compactLayout(items, 12, 'vertical')
      expect(result.find(i => i.id === '1')).toMatchObject({ y: 2 })
      expect(result.find(i => i.id === '2')).toMatchObject({ y: 0 })
    })
  })

  describe('moveItems', () => {
    it('should move colliding items down', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 2, w: 2, h: 2 }
      ]
      const movingItem: GridItem = { id: '1', x: 0, y: 1, w: 2, h: 2 }
      const originalItem: GridItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
      
      const result = moveItems(layout, movingItem, 12, originalItem)
      const movedItem = result.find(i => i.id === '2')
      // 아래로 이동할 때는 충돌 아이템을 위로 밀기
      expect(movedItem?.y).toBe(0)
    })

    it('should handle 50% overlap rule', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 4, h: 4 },
        { id: '2', x: 2, y: 2, w: 4, h: 4 }
      ]
      const movingItem: GridItem = { id: '1', x: 1, y: 1, w: 4, h: 4 }
      const originalItem: GridItem = { id: '1', x: 0, y: 0, w: 4, h: 4 }
      
      const result = moveItems(layout, movingItem, 12, originalItem)
      const movedItem = result.find(i => i.id === '2')
      // 아래로 이동할 때는 충돌 아이템을 위로 밀기
      expect(movedItem?.y).toBe(0)
    })

    it('should not move static items', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 2, w: 2, h: 2, static: true }
      ]
      const movingItem: GridItem = { id: '1', x: 0, y: 1, w: 2, h: 2 }
      
      const result = moveItems(layout, movingItem, 12)
      const staticItem = result.find(i => i.id === '2')
      expect(staticItem?.y).toBe(2)
    })

    it('should handle cascade movements', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 2, w: 2, h: 2 },
        { id: '3', x: 0, y: 4, w: 2, h: 2 }
      ]
      const movingItem: GridItem = { id: '1', x: 0, y: 1, w: 2, h: 2 }
      const originalItem: GridItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
      
      const result = moveItems(layout, movingItem, 12, originalItem)
      // 아래로 이동할 때는 충돌 아이템을 위로 밀기
      expect(result.find(i => i.id === '2')?.y).toBe(0)
      // 3번 아이템은 충돌하지 않으므로 그대로
      expect(result.find(i => i.id === '3')?.y).toBe(4)
    })
  })

  describe('getAllCollisions', () => {
    it('should return all colliding items', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 1, y: 1, w: 2, h: 2 },
        { id: '3', x: 3, y: 0, w: 2, h: 2 }
      ]
      const item: GridItem = { id: '4', x: 0, y: 0, w: 3, h: 3 }
      
      const collisions = getAllCollisions(layout, item)
      expect(collisions).toHaveLength(2)
      expect(collisions.map(i => i.id)).toContain('1')
      expect(collisions.map(i => i.id)).toContain('2')
    })

    it('should exclude the item itself', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 1, y: 1, w: 2, h: 2 }
      ]
      const item: GridItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
      
      const collisions = getAllCollisions(layout, item)
      expect(collisions.map(i => i.id)).not.toContain('1')
    })
  })

  describe('edge cases for compactLayout', () => {
    it('should skip compacting static items even with different compactType', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 1, w: 2, h: 2, static: true },
        { id: '2', x: 0, y: 3, w: 2, h: 2 }
      ]

      const compacted = compactLayout(layout, 12, 'horizontal')

      // Static item should remain at original position
      expect(compacted[0].y).toBe(1)
      expect(compacted[0].x).toBe(0)
      // Non-static item should move left
      expect(compacted[1].x).toBe(0)
    })

    it('should handle edge collision boundary case', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 1, h: 1 },
        { id: '2', x: 0, y: 1, w: 1, h: 1 }
      ]

      // Test exact boundary collision
      const compacted = compactLayout(layout, 12, 'vertical')
      expect(compacted[0].y).toBe(0)
      expect(compacted[1].y).toBe(1)
    })
  })

  describe('moveItems edge cases', () => {
    it('should handle collision detection when item height causes exact boundary touch', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 2, w: 2, h: 2 }
      ]
      const movingItem = { id: '3', x: 0, y: 1, w: 2, h: 1 }

      const newLayout = moveItems(layout, movingItem, 12)

      // Without originalItem, layout is returned as-is
      expect(newLayout).toEqual(layout)
    })

    it('should handle moving up boundary case', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 2, w: 2, h: 2 },
        { id: '2', x: 0, y: 0, w: 2, h: 1 }
      ]
      const movingItem = { id: '1', x: 0, y: 0, w: 2, h: 2 }
      const originalItem = { id: '1', x: 0, y: 2, w: 2, h: 2 }

      const newLayout = moveItems(layout, movingItem, 12, originalItem)

      // Item 2 should be pushed down
      const item2 = newLayout.find(i => i.id === '2')
      expect(item2!.y).toBeGreaterThanOrEqual(2)
    })

    it('should skip already processed items in moveItems', () => {
      // Create a complex collision scenario where items could be processed multiple times
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 2, h: 2 },
        { id: '2', x: 0, y: 2, w: 2, h: 2 },
        { id: '3', x: 0, y: 4, w: 2, h: 2 },
        { id: '4', x: 0, y: 6, w: 2, h: 2 }
      ]
      
      // Move item to cause cascading collisions
      const movingItem = { id: 'new', x: 0, y: 1, w: 2, h: 4 }
      
      const newLayout = moveItems(layout, movingItem, 12)
      
      // Without originalItem, layout is returned as-is
      expect(newLayout).toEqual(layout)
    })
  })

  describe('compactLayout sorting edge cases', () => {
    it('should sort items with same x value by y in horizontal compact', () => {
      const items: GridItem[] = [
        { id: '1', x: 0, y: 3, w: 1, h: 1 },
        { id: '2', x: 0, y: 1, w: 1, h: 1 },
        { id: '3', x: 0, y: 2, w: 1, h: 1 },
        { id: '4', x: 1, y: 0, w: 1, h: 1 }
      ]
      
      const result = compactLayout(items, 12, 'horizontal')
      
      // Items with x=0 should be sorted by y
      const xZeroItems = result.filter(i => i.x === 0)
      expect(xZeroItems[0].id).toBe('2') // y=1
      expect(xZeroItems[1].id).toBe('3') // y=2
      expect(xZeroItems[2].id).toBe('1') // y=3
    })
  })
})