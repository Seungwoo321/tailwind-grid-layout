import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { ResponsiveGridContainer, WidthProvider } from '../../src'
import type { BreakpointLayouts } from '../../src'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

/**
 * ResponsiveGridContainer는 브레이크포인트별로 다른 레이아웃을 지원하는 반응형 그리드입니다.
 */
const meta: Meta<typeof ResponsiveGridContainer> = {
  title: 'Components/ResponsiveGridContainer',
  component: ResponsiveGridContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '브레이크포인트별 레이아웃을 지원하는 반응형 그리드 컨테이너입니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onBreakpointChange: fn(),
    onLayoutChange: fn(),
  },
  argTypes: {
    rowHeight: {
      control: { type: 'number', min: 20, max: 200 },
      description: '행 높이 (픽셀)',
    },
    gap: {
      control: { type: 'number', min: 0, max: 50 },
      description: '아이템 간 간격',
    },
    isDraggable: {
      control: 'boolean',
      description: '드래그 활성화',
    },
    isResizable: {
      control: 'boolean',
      description: '리사이즈 활성화',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const defaultLayouts: BreakpointLayouts = {
  lg: [
    { id: '1', x: 0, y: 0, w: 3, h: 2 },
    { id: '2', x: 3, y: 0, w: 3, h: 2 },
    { id: '3', x: 6, y: 0, w: 3, h: 2 },
    { id: '4', x: 9, y: 0, w: 3, h: 2 },
  ],
  md: [
    { id: '1', x: 0, y: 0, w: 5, h: 2 },
    { id: '2', x: 5, y: 0, w: 5, h: 2 },
    { id: '3', x: 0, y: 2, w: 5, h: 2 },
    { id: '4', x: 5, y: 2, w: 5, h: 2 },
  ],
  sm: [
    { id: '1', x: 0, y: 0, w: 6, h: 2 },
    { id: '2', x: 0, y: 2, w: 6, h: 2 },
    { id: '3', x: 0, y: 4, w: 6, h: 2 },
    { id: '4', x: 0, y: 6, w: 6, h: 2 },
  ],
  xs: [
    { id: '1', x: 0, y: 0, w: 4, h: 2 },
    { id: '2', x: 0, y: 2, w: 4, h: 2 },
    { id: '3', x: 0, y: 4, w: 4, h: 2 },
    { id: '4', x: 0, y: 6, w: 4, h: 2 },
  ],
  xxs: [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 0, y: 2, w: 2, h: 2 },
    { id: '3', x: 0, y: 4, w: 2, h: 2 },
    { id: '4', x: 0, y: 6, w: 2, h: 2 },
  ],
}

/**
 * 기본 반응형 그리드입니다.
 * 브라우저 창 크기를 조절하여 레이아웃 변화를 확인하세요.
 */
export const Default: Story = {
  args: {
    rowHeight: 80,
    gap: 16,
    isDraggable: true,
    isResizable: true,
  },
  render: (args) => {
    const [layouts, setLayouts] = useState<BreakpointLayouts>(defaultLayouts)

    return (
      <div className="p-4 bg-slate-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-800 mb-1">Responsive Grid</h1>
          <p className="text-slate-500 text-sm">
            Breakpoints: xxs: 0, xs: 480, sm: 768, md: 996, lg: 1200
          </p>
        </div>

        <ResponsiveGridWithWidth
          layouts={layouts}
          onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts)}
          {...args}
          className="bg-white rounded border border-slate-200"
        >
          {(item) => (
            <div className="h-full bg-slate-700 rounded border border-slate-600 p-3 text-slate-100 overflow-auto">
              <div className="text-sm font-medium">{item.id}</div>
              <div className="text-xs text-slate-400 mt-1">
                ({item.x}, {item.y}) {item.w}x{item.h}
              </div>
            </div>
          )}
        </ResponsiveGridWithWidth>
      </div>
    )
  },
}

/**
 * 커스텀 브레이크포인트와 컬럼 수를 사용합니다.
 */
export const CustomBreakpoints: Story = {
  render: () => {
    const customBreakpoints = {
      desktop: 1440,
      tablet: 768,
      mobile: 320,
    }

    const customCols = {
      desktop: 16,
      tablet: 8,
      mobile: 4,
    }

    const customLayouts = {
      desktop: [
        { id: '1', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 4, h: 2 },
        { id: '3', x: 8, y: 0, w: 4, h: 2 },
        { id: '4', x: 12, y: 0, w: 4, h: 2 },
      ],
      tablet: [
        { id: '1', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', x: 4, y: 0, w: 4, h: 2 },
        { id: '3', x: 0, y: 2, w: 4, h: 2 },
        { id: '4', x: 4, y: 2, w: 4, h: 2 },
      ],
      mobile: [
        { id: '1', x: 0, y: 0, w: 4, h: 2 },
        { id: '2', x: 0, y: 2, w: 4, h: 2 },
        { id: '3', x: 0, y: 4, w: 4, h: 2 },
        { id: '4', x: 0, y: 6, w: 4, h: 2 },
      ],
    }

    const [layouts, setLayouts] = useState(customLayouts)

    const ResponsiveCustom = WidthProvider(ResponsiveGridContainer)

    return (
      <div className="p-4 bg-slate-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-800 mb-1">Custom Breakpoints</h1>
          <p className="text-slate-500 text-sm">
            mobile: 320, tablet: 768, desktop: 1440 | cols: 4, 8, 16
          </p>
        </div>

        <ResponsiveCustom
          layouts={layouts}
          breakpoints={customBreakpoints}
          cols={customCols}
          rowHeight={80}
          gap={16}
          onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts as typeof customLayouts)}
          className="bg-white rounded border border-slate-200"
        >
          {(item) => (
            <div className="h-full bg-slate-600 rounded border border-slate-500 p-3 text-slate-100 flex flex-col justify-center items-center overflow-auto">
              <div className="text-sm">{item.id}</div>
              <div className="text-xs text-slate-400">{item.w}x{item.h}</div>
            </div>
          )}
        </ResponsiveCustom>
      </div>
    )
  },
}

/**
 * 대시보드 레이아웃 예제입니다.
 */
export const Dashboard: Story = {
  render: () => {
    const dashboardLayouts: BreakpointLayouts = {
      lg: [
        { id: 'stats', x: 0, y: 0, w: 3, h: 2 },
        { id: 'chart', x: 3, y: 0, w: 6, h: 4 },
        { id: 'recent', x: 9, y: 0, w: 3, h: 4 },
        { id: 'table', x: 0, y: 2, w: 3, h: 4 },
        { id: 'timeline', x: 3, y: 4, w: 9, h: 2 },
      ],
      md: [
        { id: 'stats', x: 0, y: 0, w: 5, h: 2 },
        { id: 'chart', x: 5, y: 0, w: 5, h: 4 },
        { id: 'recent', x: 0, y: 2, w: 5, h: 3 },
        { id: 'table', x: 0, y: 5, w: 5, h: 3 },
        { id: 'timeline', x: 5, y: 4, w: 5, h: 2 },
      ],
      sm: [
        { id: 'stats', x: 0, y: 0, w: 6, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 6, h: 4 },
        { id: 'recent', x: 0, y: 6, w: 6, h: 3 },
        { id: 'table', x: 0, y: 9, w: 6, h: 3 },
        { id: 'timeline', x: 0, y: 12, w: 6, h: 2 },
      ],
      xs: [
        { id: 'stats', x: 0, y: 0, w: 4, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 4, h: 4 },
        { id: 'recent', x: 0, y: 6, w: 4, h: 3 },
        { id: 'table', x: 0, y: 9, w: 4, h: 3 },
        { id: 'timeline', x: 0, y: 12, w: 4, h: 2 },
      ],
      xxs: [
        { id: 'stats', x: 0, y: 0, w: 2, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 2, h: 3 },
        { id: 'recent', x: 0, y: 5, w: 2, h: 3 },
        { id: 'table', x: 0, y: 8, w: 2, h: 3 },
        { id: 'timeline', x: 0, y: 11, w: 2, h: 2 },
      ],
    }

    const [layouts, setLayouts] = useState(dashboardLayouts)

    const widgetLabels: Record<string, string> = {
      stats: 'Stats',
      chart: 'Chart',
      recent: 'Recent',
      table: 'Table',
      timeline: 'Timeline',
    }

    return (
      <div className="p-4 bg-slate-100 min-h-screen">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-slate-800">Dashboard</h1>
          <p className="text-slate-500 text-sm">Resize window to see responsive layout</p>
        </div>

        <ResponsiveGridWithWidth
          layouts={layouts}
          onLayoutChange={(layout, allLayouts) => setLayouts(allLayouts)}
          rowHeight={60}
          gap={12}
          className="rounded"
        >
          {(item) => (
            <div className="h-full bg-white rounded border border-slate-200 p-3 flex flex-col overflow-auto">
              <div className="text-sm font-medium text-slate-700">
                {widgetLabels[item.id] || item.id}
              </div>
              <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
                {item.w} x {item.h}
              </div>
            </div>
          )}
        </ResponsiveGridWithWidth>
      </div>
    )
  },
}
