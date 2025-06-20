import { useState, useEffect, useMemo, useRef } from 'react'
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
  // Initialize with actual breakpoint based on current width
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>(() => {
    const initialWidth = width ?? (typeof window !== 'undefined' ? window.innerWidth : 1200)
    const sortedBps = Object.entries(breakpoints).sort((a, b) => b[1] - a[1])
    for (const [bp, minWidth] of sortedBps) {
      if (initialWidth >= minWidth) {
        return bp
      }
    }
    return sortedBps[sortedBps.length - 1]?.[0] || 'lg'
  })
  const [currentCols, setCurrentCols] = useState(() => {
    const colsForBreakpoint = typeof cols === 'object' ? cols[currentBreakpoint] : undefined
    return colsForBreakpoint || (defaultCols as Record<string, number>)[currentBreakpoint] || 12
  })

  // Get sorted breakpoints
  const sortedBreakpoints = useMemo(() => {
    return Object.entries(breakpoints).sort((a, b) => b[1] - a[1])
  }, [breakpoints])

  // Calculate current breakpoint based on window width
  const getBreakpoint = useMemo(() => (width: number) => {
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
  }, [sortedBreakpoints])

  // Handle window resize with debouncing
  const resizeTimeoutRef = useRef<NodeJS.Timeout>()
  
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

    // Debounced resize handler
    const debouncedHandleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(handleResize, 150)
    }

    // Call initial handleResize for setting up correct state
    handleResize()
    
    // Only listen to window resize if width is not provided
    if (width === undefined) {
      window.addEventListener('resize', debouncedHandleResize)
      return () => {
        window.removeEventListener('resize', debouncedHandleResize)
        if (resizeTimeoutRef.current) {
          clearTimeout(resizeTimeoutRef.current)
        }
      }
    } else {
      // When width is provided, we still need to check for breakpoint changes
      handleResize()
    }
    return undefined
  }, [currentBreakpoint, cols, sortedBreakpoints, onBreakpointChange, width, getBreakpoint])

  // Call onBreakpointChange on mount if provided
  useEffect(() => {
    if (onBreakpointChange) {
      onBreakpointChange(currentBreakpoint, currentCols)
    }
  }, []) // Only on mount

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