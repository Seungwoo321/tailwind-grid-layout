import { describe, it, expect } from 'vitest'
import { generateLayouts, generateResponsiveLayouts } from '../layouts'
import type { GridItem } from '../../types'

describe('Layout Utilities', () => {
  const sampleLayout: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 4, h: 2 },
    { id: '2', x: 4, y: 0, w: 4, h: 2 },
    { id: '3', x: 0, y: 2, w: 8, h: 2 }
  ]

  describe('generateLayouts', () => {
    it('should generate layouts for all breakpoints', () => {
      const breakpoints = ['lg', 'md', 'sm']
      const result = generateLayouts(sampleLayout, breakpoints)
      
      expect(Object.keys(result)).toEqual(breakpoints)
      breakpoints.forEach(bp => {
        expect(result[bp]).toHaveLength(3)
        expect(result[bp]).toEqual(sampleLayout)
      })
    })

    it('should use default breakpoints when not specified', () => {
      const result = generateLayouts(sampleLayout)
      const defaultBreakpoints = ['lg', 'md', 'sm', 'xs', 'xxs']
      
      expect(Object.keys(result)).toEqual(defaultBreakpoints)
    })

    it('should create deep copies of items', () => {
      const result = generateLayouts(sampleLayout, ['lg'])
      
      result.lg[0].x = 10
      expect(sampleLayout[0].x).toBe(0)
    })
  })

  describe('generateResponsiveLayouts', () => {
    it('should adjust layouts for different column counts', () => {
      const colsMap = { lg: 12, md: 8, sm: 4 }
      const result = generateResponsiveLayouts(sampleLayout, colsMap)
      
      // lg: items should keep original dimensions
      expect(result.lg[0]).toEqual({ id: '1', x: 0, y: 0, w: 4, h: 2 })
      expect(result.lg[1]).toEqual({ id: '2', x: 4, y: 0, w: 4, h: 2 })
      
      // md: width should be capped at 8 columns
      expect(result.md[2]).toEqual({ id: '3', x: 0, y: 2, w: 8, h: 2 })
      
      // sm: width should be capped at 4 columns
      expect(result.sm[0].w).toBe(4)
      expect(result.sm[1].w).toBe(4)
      expect(result.sm[1].x).toBe(0) // Should be repositioned
      expect(result.sm[2].w).toBe(4)
    })

    it('should use default column configuration', () => {
      const result = generateResponsiveLayouts(sampleLayout)
      
      expect(result).toHaveProperty('lg')
      expect(result).toHaveProperty('md')
      expect(result).toHaveProperty('sm')
      expect(result).toHaveProperty('xs')
      expect(result).toHaveProperty('xxs')
    })
  })

})