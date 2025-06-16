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
      
      expect(result).toEqual({
        left: 196,
        top: 76,
        width: 280,
        height: 136
      })
    })

    it('should use margin when provided', () => {
      const item: GridPosition = { x: 2, y: 1, w: 3, h: 2 }
      const result = getPixelPosition(item, 12, 60, 16, 1200, [10, 20])
      
      expect(result).toEqual({
        left: 194,
        top: 80,
        width: 286,
        height: 140
      })
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
      expect(movedItem?.y).toBe(3)
    })

    it('should handle 50% overlap rule', () => {
      const layout: GridItem[] = [
        { id: '1', x: 0, y: 0, w: 4, h: 4 },
        { id: '2', x: 2, y: 2, w: 4, h: 4 }
      ]
      const movingItem: GridItem = { id: '1', x: 1, y: 1, w: 4, h: 4 }
      
      const result = moveItems(layout, movingItem, 12)
      const movedItem = result.find(i => i.id === '2')
      expect(movedItem?.y).toBe(5)
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
      
      const result = moveItems(layout, movingItem, 12)
      expect(result.find(i => i.id === '2')?.y).toBe(3)
      expect(result.find(i => i.id === '3')?.y).toBe(5)
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
})