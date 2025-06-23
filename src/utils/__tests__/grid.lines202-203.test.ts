import { describe, it, expect } from 'vitest'
import { shouldSwapItems } from '../grid'
import type { GridItem } from '../../types'

describe('grid.ts - Lines 202-203 Coverage', () => {
  const createGridItem = (id: string, x: number, y: number, w: number = 2, h: number = 2): GridItem => ({
    id,
    x,
    y,
    w,
    h
  })

  describe('shouldSwapItems - moving down scenarios (line 202)', () => {
    it('should return true when moving down and dragging center is below target center', () => {
      // Setup: dragging item is moving down (y: 0 -> 2)
      const originalItem = createGridItem('drag', 0, 0, 2, 2)
      const draggingItem = createGridItem('drag', 0, 2, 2, 2) // moved down
      const targetItem = createGridItem('target', 0, 1, 2, 2)
      
      // draggingCenterY = 2 + 2/2 = 3
      // targetCenterY = 1 + 2/2 = 2
      // isMovingDown = true (2 > 0)
      // draggingCenterY > targetCenterY = true (3 > 2)
      // This should hit line 202 and return true
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(true)
    })
    
    it('should not return true when moving down but dragging center is above target center', () => {
      // Setup: dragging item is moving down but center is still above target
      const originalItem = createGridItem('drag', 0, 0, 2, 1)
      const draggingItem = createGridItem('drag', 0, 1, 2, 1) // moved down slightly
      const targetItem = createGridItem('target', 0, 2, 2, 2)
      
      // draggingCenterY = 1 + 1/2 = 1.5
      // targetCenterY = 2 + 2/2 = 3
      // isMovingDown = true (1 > 0)
      // draggingCenterY > targetCenterY = false (1.5 < 3)
      // This should NOT hit line 202
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(false)
    })
  })

  describe('shouldSwapItems - moving up scenarios (line 203)', () => {
    it('should return true when moving up and dragging center is above target center', () => {
      // Setup: dragging item is moving up (y: 3 -> 1)
      const originalItem = createGridItem('drag', 0, 3, 2, 2)
      const draggingItem = createGridItem('drag', 0, 1, 2, 2) // moved up
      const targetItem = createGridItem('target', 0, 2, 2, 2)
      
      // draggingCenterY = 1 + 2/2 = 2
      // targetCenterY = 2 + 2/2 = 3
      // isMovingUp = true (1 < 3)
      // draggingCenterY < targetCenterY = true (2 < 3)
      // This should hit line 203 and return true
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(true)
    })
    
    it('should not return true when moving up but dragging center is below target center', () => {
      // Setup: dragging item is moving up but center is still below target
      const originalItem = createGridItem('drag', 0, 4, 2, 1)
      const draggingItem = createGridItem('drag', 0, 3, 2, 1) // moved up slightly
      const targetItem = createGridItem('target', 0, 1, 2, 2)
      
      // draggingCenterY = 3 + 1/2 = 3.5
      // targetCenterY = 1 + 2/2 = 2
      // isMovingUp = true (3 < 4)
      // draggingCenterY < targetCenterY = false (3.5 > 2)
      // This should NOT hit line 203
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(false)
    })
  })

  describe('shouldSwapItems - edge cases for complete coverage', () => {
    it('should handle items with different heights for moving down', () => {
      // Test with different sized items
      const originalItem = createGridItem('drag', 1, 0, 1, 1)
      const draggingItem = createGridItem('drag', 1, 3, 1, 1) // small item moving down
      const targetItem = createGridItem('target', 1, 2, 1, 3) // tall target item
      
      // draggingCenterY = 3 + 1/2 = 3.5
      // targetCenterY = 2 + 3/2 = 3.5
      // isMovingDown = true (3 > 0)
      // draggingCenterY > targetCenterY = false (3.5 == 3.5)
      // Should not hit line 202
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(false)
    })
    
    it('should handle precise center alignment for moving up', () => {
      // Test exact center alignment
      const originalItem = createGridItem('drag', 2, 4, 2, 2)
      const draggingItem = createGridItem('drag', 2, 1, 2, 2) // moved up significantly
      const targetItem = createGridItem('target', 2, 3, 2, 2)
      
      // draggingCenterY = 1 + 2/2 = 2
      // targetCenterY = 3 + 2/2 = 4
      // isMovingUp = true (1 < 4)
      // draggingCenterY < targetCenterY = true (2 < 4)
      // This should hit line 203 and return true
      
      const result = shouldSwapItems(draggingItem, targetItem, originalItem)
      expect(result).toBe(true)
    })
  })
})