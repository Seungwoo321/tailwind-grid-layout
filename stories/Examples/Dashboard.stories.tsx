import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { ResponsiveGridContainer, WidthProvider } from '../../src'
import type { BreakpointLayouts } from '../../src/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../src/components/ui/card'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

/**
 * 실제 대시보드 사용 예제입니다.
 */
const meta: Meta<typeof ResponsiveGridContainer> = {
  title: 'Examples/Dashboard',
  component: ResponsiveGridContainer,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    onLayoutChange: fn(),
    onBreakpointChange: fn(),
  },
}

export default meta
type Story = StoryObj

/**
 * 분석 대시보드 예제입니다.
 * 다양한 위젯을 드래그하여 원하는 레이아웃을 구성할 수 있습니다.
 */
export const AnalyticsDashboard: Story = {
  render: () => {
    const [layouts, setLayouts] = useState<BreakpointLayouts>({
      lg: [
        { id: 'revenue', x: 0, y: 0, w: 3, h: 2 },
        { id: 'users', x: 3, y: 0, w: 3, h: 2 },
        { id: 'orders', x: 6, y: 0, w: 3, h: 2 },
        { id: 'conversion', x: 9, y: 0, w: 3, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 8, h: 4 },
        { id: 'recent', x: 8, y: 2, w: 4, h: 4 },
        { id: 'products', x: 0, y: 6, w: 6, h: 3 },
        { id: 'traffic', x: 6, y: 6, w: 6, h: 3 },
      ],
      md: [
        { id: 'revenue', x: 0, y: 0, w: 5, h: 2 },
        { id: 'users', x: 5, y: 0, w: 5, h: 2 },
        { id: 'orders', x: 0, y: 2, w: 5, h: 2 },
        { id: 'conversion', x: 5, y: 2, w: 5, h: 2 },
        { id: 'chart', x: 0, y: 4, w: 10, h: 4 },
        { id: 'recent', x: 0, y: 8, w: 10, h: 3 },
        { id: 'products', x: 0, y: 11, w: 5, h: 3 },
        { id: 'traffic', x: 5, y: 11, w: 5, h: 3 },
      ],
      sm: [
        { id: 'revenue', x: 0, y: 0, w: 3, h: 2 },
        { id: 'users', x: 3, y: 0, w: 3, h: 2 },
        { id: 'orders', x: 0, y: 2, w: 3, h: 2 },
        { id: 'conversion', x: 3, y: 2, w: 3, h: 2 },
        { id: 'chart', x: 0, y: 4, w: 6, h: 4 },
        { id: 'recent', x: 0, y: 8, w: 6, h: 3 },
        { id: 'products', x: 0, y: 11, w: 6, h: 3 },
        { id: 'traffic', x: 0, y: 14, w: 6, h: 3 },
      ],
      xs: [
        { id: 'revenue', x: 0, y: 0, w: 2, h: 2 },
        { id: 'users', x: 2, y: 0, w: 2, h: 2 },
        { id: 'orders', x: 0, y: 2, w: 2, h: 2 },
        { id: 'conversion', x: 2, y: 2, w: 2, h: 2 },
        { id: 'chart', x: 0, y: 4, w: 4, h: 3 },
        { id: 'recent', x: 0, y: 7, w: 4, h: 3 },
        { id: 'products', x: 0, y: 10, w: 4, h: 3 },
        { id: 'traffic', x: 0, y: 13, w: 4, h: 3 },
      ],
      xxs: [
        { id: 'revenue', x: 0, y: 0, w: 2, h: 2 },
        { id: 'users', x: 0, y: 2, w: 2, h: 2 },
        { id: 'orders', x: 0, y: 4, w: 2, h: 2 },
        { id: 'conversion', x: 0, y: 6, w: 2, h: 2 },
        { id: 'chart', x: 0, y: 8, w: 2, h: 3 },
        { id: 'recent', x: 0, y: 11, w: 2, h: 3 },
        { id: 'products', x: 0, y: 14, w: 2, h: 3 },
        { id: 'traffic', x: 0, y: 17, w: 2, h: 3 },
      ],
    })

    const widgets: Record<string, { title: string; value: string; change: string; color: string }> = {
      revenue: { title: 'Total Revenue', value: '$45,231', change: '+20.1%', color: 'text-green-600' },
      users: { title: 'Active Users', value: '2,350', change: '+15.2%', color: 'text-green-600' },
      orders: { title: 'Orders', value: '1,247', change: '-3.1%', color: 'text-red-600' },
      conversion: { title: 'Conversion', value: '3.2%', change: '+0.5%', color: 'text-green-600' },
    }

    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-500">Drag and resize widgets to customize your view</p>
        </div>

        <ResponsiveGridWithWidth
          layouts={layouts}
          onLayoutChange={(_, allLayouts) => setLayouts(allLayouts)}
          rowHeight={60}
          gap={16}
          className="rounded-xl"
        >
          {(item) => {
            const widget = widgets[item.id]

            if (widget) {
              return (
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardDescription>{widget.title}</CardDescription>
                    <CardTitle className="text-2xl">{widget.value}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <span className={`text-sm font-medium ${widget.color}`}>
                      {widget.change} from last month
                    </span>
                  </CardContent>
                </Card>
              )
            }

            if (item.id === 'chart') {
              return (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue for the past year</CardDescription>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[calc(100%-80px)]">
                    <div className="text-gray-400 text-sm">Chart Placeholder</div>
                  </CardContent>
                </Card>
              )
            }

            if (item.id === 'recent') {
              return (
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex-shrink-0">
                    <CardTitle>Recent Sales</CardTitle>
                    <CardDescription>You made 265 sales this month</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 overflow-auto flex-1 min-h-0">
                    {['Olivia Martin', 'Jackson Lee', 'Isabella Nguyen'].map((name) => (
                      <div key={name} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{name}</p>
                          <p className="text-xs text-gray-500">email@example.com</p>
                        </div>
                        <span className="text-sm font-medium">+$1,999</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )
            }

            if (item.id === 'products') {
              return (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Top Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {['Product A', 'Product B', 'Product C'].map((product, i) => (
                        <div key={product} className="flex items-center justify-between">
                          <span className="text-sm">{product}</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${90 - i * 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            }

            if (item.id === 'traffic') {
              return (
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-center h-[calc(100%-60px)]">
                    <div className="text-gray-400 text-sm">Pie Chart Placeholder</div>
                  </CardContent>
                </Card>
              )
            }

            return (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  {item.id}
                </CardContent>
              </Card>
            )
          }}
        </ResponsiveGridWithWidth>
      </div>
    )
  },
}

/**
 * 간단한 위젯 대시보드입니다.
 */
export const SimpleWidgets: Story = {
  render: () => {
    const [layouts, setLayouts] = useState<BreakpointLayouts>({
      lg: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 4, y: 0, w: 4, h: 3 },
        { id: '3', x: 8, y: 0, w: 4, h: 3 },
        { id: '4', x: 0, y: 3, w: 6, h: 3 },
        { id: '5', x: 6, y: 3, w: 6, h: 3 },
      ],
      md: [
        { id: '1', x: 0, y: 0, w: 5, h: 3 },
        { id: '2', x: 5, y: 0, w: 5, h: 3 },
        { id: '3', x: 0, y: 3, w: 10, h: 3 },
        { id: '4', x: 0, y: 6, w: 5, h: 3 },
        { id: '5', x: 5, y: 6, w: 5, h: 3 },
      ],
      sm: [
        { id: '1', x: 0, y: 0, w: 6, h: 3 },
        { id: '2', x: 0, y: 3, w: 6, h: 3 },
        { id: '3', x: 0, y: 6, w: 6, h: 3 },
        { id: '4', x: 0, y: 9, w: 6, h: 3 },
        { id: '5', x: 0, y: 12, w: 6, h: 3 },
      ],
      xs: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 0, y: 3, w: 4, h: 3 },
        { id: '3', x: 0, y: 6, w: 4, h: 3 },
        { id: '4', x: 0, y: 9, w: 4, h: 3 },
        { id: '5', x: 0, y: 12, w: 4, h: 3 },
      ],
      xxs: [
        { id: '1', x: 0, y: 0, w: 2, h: 3 },
        { id: '2', x: 0, y: 3, w: 2, h: 3 },
        { id: '3', x: 0, y: 6, w: 2, h: 3 },
        { id: '4', x: 0, y: 9, w: 2, h: 3 },
        { id: '5', x: 0, y: 12, w: 2, h: 3 },
      ],
    })

    const colors = [
      'bg-slate-700 border-slate-600',
      'bg-slate-600 border-slate-500',
      'bg-slate-800 border-slate-700',
      'bg-slate-500 border-slate-400',
      'bg-slate-700 border-slate-600',
    ]

    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Widget Dashboard</h1>

        <ResponsiveGridWithWidth
          layouts={layouts}
          onLayoutChange={(_, allLayouts) => setLayouts(allLayouts)}
          rowHeight={60}
          gap={12}
        >
          {(item) => {
            const index = parseInt(item.id) - 1
            const color = colors[index % colors.length]

            return (
              <div className={`h-full ${color} border rounded p-4 text-slate-100`}>
                <h3 className="font-medium text-sm">Widget {item.id}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {item.w} x {item.h}
                </p>
              </div>
            )
          }}
        </ResponsiveGridWithWidth>
      </div>
    )
  },
}
