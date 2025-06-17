import type { GridItem } from '../types'
import type { BreakpointLayouts } from '../components/ResponsiveGridContainer'

/**
 * 모든 breakpoint에 동일한 레이아웃을 적용
 * react-grid-layout의 generateLayouts와 동일
 */
export function generateLayouts(
  layout: GridItem[],
  breakpoints: string[] = ['lg', 'md', 'sm', 'xs', 'xxs']
): BreakpointLayouts {
  return breakpoints.reduce((acc, bp) => {
    acc[bp] = layout.map(item => ({ ...item }))
    return acc
  }, {} as BreakpointLayouts)
}

/**
 * 반응형 레이아웃 생성 (breakpoint별로 다른 컬럼 수에 맞춤)
 * react-grid-layout과 동일한 동작
 */
export function generateResponsiveLayouts(
  items: GridItem[],
  colsMap: { [breakpoint: string]: number } = {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  }
): BreakpointLayouts {
  const layouts: BreakpointLayouts = {}

  Object.entries(colsMap).forEach(([bp, cols]) => {
    layouts[bp] = items.map(item => {
      // 컬럼 수에 맞춰 너비 조정
      const adjustedWidth = Math.min(item.w, cols)
      const adjustedX = item.x + adjustedWidth > cols ? cols - adjustedWidth : item.x

      return {
        ...item,
        w: adjustedWidth,
        x: adjustedX
      }
    })
  })

  return layouts
}

