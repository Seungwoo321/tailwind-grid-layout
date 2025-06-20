import { useState, useEffect, useMemo } from 'react'
import { GridContainer } from './GridContainer'
import type { GridItem, GridContainerProps } from '../types'

export interface BreakpointLayouts {
  [breakpoint: string]: GridItem[]
}

export interface ResponsiveGridContainerProps extends Omit<GridContainerProps, 'items' | 'cols' | 'onLayoutChange'> {
  layouts: BreakpointLayouts
  breakpoints?: { [breakpoint: string]: number }
  cols?: { [breakpoint: string]: number }
  onLayoutChange?: (layout: GridItem[], layouts: BreakpointLayouts) => void
  onBreakpointChange?: (newBreakpoint: string, cols: number) => void
  width?: number // For WidthProvider support
}

const defaultBreakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0,
}

const defaultCols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2,
}

export function ResponsiveGridContainer({
  layouts,
  breakpoints = defaultBreakpoints,
  cols = defaultCols,
  onLayoutChange,
  onBreakpointChange,
  width,
  ...props
}: ResponsiveGridContainerProps) {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg')
  const [currentCols, setCurrentCols] = useState(
    typeof cols === 'object' && cols.lg ? cols.lg : 12
  )

  // Get sorted breakpoints
  const sortedBreakpoints = useMemo(() => {
    return Object.entries(breakpoints).sort((a, b) => b[1] - a[1])
  }, [breakpoints])

  // Calculate current breakpoint based on window width
  const getBreakpoint = (width: number) => {
    // Default to 'lg' if no breakpoints are sorted
    if (sortedBreakpoints.length === 0) return 'lg'
    
    const lastEntry = sortedBreakpoints[sortedBreakpoints.length - 1]
    // lastEntry cannot be undefined here since we checked length > 0
    let breakpoint = lastEntry![0]
    
    for (const [bp, minWidth] of sortedBreakpoints) {
      if (width >= minWidth) {
        breakpoint = bp
        break
      }
    }
    
    return breakpoint
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const containerWidth = width ?? window.innerWidth
      const newBreakpoint = getBreakpoint(containerWidth)
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint)
        const newCols = (typeof cols === 'object' && cols[newBreakpoint]) || 
                        (defaultCols as Record<string, number>)[newBreakpoint] || 
                        12
        setCurrentCols(newCols)
        onBreakpointChange?.(newBreakpoint, newCols)
      }
    }

    handleResize() // Set initial breakpoint
    
    // Only listen to window resize if width is not provided
    if (width === undefined) {
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }
    return undefined
  }, [currentBreakpoint, cols, sortedBreakpoints, onBreakpointChange, width])

  // Get current layout
  const currentLayout = layouts[currentBreakpoint] || []

  // Handle layout change
  const handleLayoutChange = (newLayout: GridItem[]) => {
    const newLayouts = {
      ...layouts,
      [currentBreakpoint]: newLayout,
    }
    onLayoutChange?.(newLayout, newLayouts)
  }

  return (
    <GridContainer
      {...props}
      items={currentLayout}
      cols={currentCols}
      onLayoutChange={handleLayoutChange}
    />
  )
}