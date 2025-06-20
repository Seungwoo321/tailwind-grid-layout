import React, { useState } from 'react'
import { GridContainer, ResponsiveGridContainer, WidthProvider } from '../../src'
import type { GridItem, BreakpointLayouts } from '../../src'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../src/components/ui/card'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

export function ShowcaseExample() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>('lg')

  // Responsive Dashboard Example
  const [dashboardLayouts, setDashboardLayouts] = useState<BreakpointLayouts>({
    lg: [
      { id: 'stats', x: 0, y: 0, w: 3, h: 2 },
      { id: 'chart', x: 3, y: 0, w: 6, h: 4 },
      { id: 'recent', x: 9, y: 0, w: 3, h: 4 },
      { id: 'table', x: 0, y: 2, w: 3, h: 4 },
      { id: 'timeline', x: 3, y: 4, w: 9, h: 3 },
    ],
    md: [
      { id: 'stats', x: 0, y: 0, w: 5, h: 2 },
      { id: 'chart', x: 5, y: 0, w: 5, h: 4 },
      { id: 'recent', x: 0, y: 4, w: 5, h: 3 },
      { id: 'table', x: 5, y: 4, w: 5, h: 3 },
      { id: 'timeline', x: 0, y: 7, w: 10, h: 3 },
    ],
    sm: [
      { id: 'stats', x: 0, y: 0, w: 6, h: 2 },
      { id: 'chart', x: 0, y: 2, w: 6, h: 4 },
      { id: 'recent', x: 0, y: 6, w: 6, h: 3 },
      { id: 'table', x: 0, y: 9, w: 6, h: 3 },
      { id: 'timeline', x: 0, y: 12, w: 6, h: 3 },
    ],
    xs: [
      { id: 'stats', x: 0, y: 0, w: 4, h: 2 },
      { id: 'chart', x: 0, y: 2, w: 4, h: 4 },
      { id: 'recent', x: 0, y: 6, w: 4, h: 3 },
      { id: 'table', x: 0, y: 9, w: 4, h: 3 },
      { id: 'timeline', x: 0, y: 12, w: 4, h: 3 },
    ],
    xxs: [
      { id: 'stats', x: 0, y: 0, w: 2, h: 2 },
      { id: 'chart', x: 0, y: 2, w: 2, h: 4 },
      { id: 'recent', x: 0, y: 6, w: 2, h: 3 },
      { id: 'table', x: 0, y: 9, w: 2, h: 3 },
      { id: 'timeline', x: 0, y: 12, w: 2, h: 3 },
    ],
  })

  // Responsive layouts for different breakpoints
  const [responsiveLayouts, setResponsiveLayouts] = useState<BreakpointLayouts>({
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
  })

  const renderDashboardItem = (item: GridItem) => {
    const content = {
      stats: {
        title: 'Total Revenue',
        description: 'Monthly recurring revenue',
        content: '$45,231.89',
        footer: '+20.1% from last month',
      },
      chart: {
        title: 'Analytics Overview',
        description: 'Your performance metrics',
        content: '📊 Chart placeholder',
        footer: 'Updated 2 hours ago',
      },
      recent: {
        title: 'Recent Activity',
        description: 'Latest updates',
        content: '📋 Activity feed',
        footer: 'View all →',
      },
      table: {
        title: 'Top Products',
        description: 'Best performing items',
        content: '📊 Table data',
        footer: 'Export data',
      },
      timeline: {
        title: 'Project Timeline',
        description: 'Upcoming milestones',
        content: '📅 Timeline view',
        footer: 'Add milestone',
      },
    }[item.id] || { title: item.id, description: '', content: '', footer: '' }

    return (
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-lg">{content.title}</CardTitle>
          <CardDescription>{content.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="text-2xl font-semibold">{content.content}</div>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">{content.footer}</p>
        </CardFooter>
      </Card>
    )
  }

  const renderResponsiveItem = (item: GridItem) => {
    const colors = ['from-blue-500 to-blue-600', 'from-green-500 to-green-600', 'from-purple-500 to-purple-600', 'from-orange-500 to-orange-600']
    const colorClass = colors[parseInt(item.id) - 1] || colors[0]

    return (
      <Card className="h-full overflow-hidden">
        <div className={`h-full bg-gradient-to-br ${colorClass} text-white`}>
          <CardHeader>
            <CardTitle>Widget {item.id}</CardTitle>
            <CardDescription className="text-white/80">Responsive layout demo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm">This widget adapts to different screen sizes</p>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-12">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Tailwind Grid Layout</h1>
        <p className="text-xl text-gray-600 mb-2">A modern grid system built with Tailwind CSS</p>
        <p className="text-gray-500">Drag, resize, and organize your content with ease</p>
      </div>

      {/* Dashboard Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Example</h2>
        <p className="text-gray-600 mb-6">
          A typical dashboard layout using shadcn/ui Card components. All widgets are draggable and resizable.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridContainer
            layouts={dashboardLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            gap={16}
            onLayoutChange={(layout, layouts) => setDashboardLayouts(layouts)}
          >
            {renderDashboardItem}
          </ResponsiveGridContainer>
        </div>
      </section>

      {/* Responsive Grid Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Responsive Breakpoints</h2>
        <p className="text-gray-600 mb-2">
          The grid automatically adapts to different screen sizes. Try resizing your browser window.
        </p>
        <div className="mb-4 text-sm text-gray-500">
          <strong>Breakpoints:</strong> lg (≥1200px) • md (≥996px) • sm (≥768px) • xs (≥480px) • xxs (≥0px)
        </div>
        <div className="mb-4 text-sm text-gray-500">
          <strong>Columns:</strong> lg: 12 • md: 10 • sm: 6 • xs: 4 • xxs: 2
        </div>
        <div className="mb-6 p-3 bg-blue-50 rounded-md text-blue-700">
          <strong>Current Breakpoint:</strong> <span className="font-mono text-lg">{currentBreakpoint}</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridContainer
            layouts={responsiveLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            onLayoutChange={(layout, layouts) => setResponsiveLayouts(layouts)}
            onBreakpointChange={(breakpoint, cols) => {
              setCurrentBreakpoint(breakpoint)
              console.log(`Breakpoint changed to: ${breakpoint}, Columns: ${cols}`)
            }}
            rowHeight={100}
            gap={16}
          >
            {renderResponsiveItem}
          </ResponsiveGridContainer>
        </div>
      </section>

      {/* Responsive Grid with WidthProvider Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Automatic Width Detection</h2>
        <p className="text-gray-600 mb-6">
          Using WidthProvider HOC for automatic container width detection. This is useful when the grid container's width is dynamic.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridWithWidth
            layouts={responsiveLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            onLayoutChange={(layout, layouts) => setResponsiveLayouts(layouts)}
            rowHeight={100}
            gap={16}
          >
            {renderResponsiveItem}
          </ResponsiveGridWithWidth>
        </div>
      </section>

      {/* Features List */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>🎯 Full Feature Parity</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Complete compatibility with react-grid-layout features including drag, resize, and responsive layouts.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>🎨 Tailwind Native</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Built entirely with Tailwind CSS utilities. No additional CSS files or style injection needed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>📦 Lightweight</CardTitle>
          </CardHeader>
          <CardContent>
            <p>50% smaller bundle size compared to react-grid-layout while maintaining all functionality.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}