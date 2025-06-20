export { GridContainer } from './components/GridContainer'
export { ResponsiveGridContainer } from './components/ResponsiveGridContainer'
export { DroppableGridContainer } from './components/DroppableGridContainer'
export { GridItemComponent } from './components/GridItem'
export { ResizeHandle } from './components/ResizeHandle'
export { WidthProvider } from './components/WidthProvider'

export * from './types'
export * from './utils/grid'
export * from './utils/touch'
export { cn } from './utils/cn'
export { enableTouchDebugging } from './utils/touch-debug'
export type { ResponsiveGridContainerProps, BreakpointLayouts } from './components/ResponsiveGridContainer'
export type { DroppableGridContainerProps } from './components/DroppableGridContainer'
export type { WidthProviderProps } from './components/WidthProvider'

// Layout utilities (react-grid-layout compatible)
export { 
  generateLayouts,
  generateResponsiveLayouts
} from './utils/layouts'