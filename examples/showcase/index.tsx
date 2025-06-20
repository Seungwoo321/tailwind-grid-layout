import React, { useState } from 'react'
import { ResponsiveGridContainer, WidthProvider } from '../../src'
import type { GridItem, BreakpointLayouts } from '../../src'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../src/components/ui/card'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

export function ShowcaseExample() {
  const [dashboardBreakpoint, setDashboardBreakpoint] = useState<string>('lg')
  const [responsiveBreakpoint, setResponsiveBreakpoint] = useState<string>('lg')

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
      <div className="text-center mb-12 relative">
        <h1 className="text-4xl font-bold mb-4">Tailwind Grid Layout</h1>
        <p className="text-xl text-gray-600 mb-2">A modern grid system built with Tailwind CSS</p>
        <p className="text-gray-500">Drag, resize, and organize your content with ease</p>
        {/* GitHub Icon */}
        <a
          href="https://github.com/Seungwoo321/tailwind-grid-layout"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="View on GitHub"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.02 10.02 0 0022 12c0-5.523-4.477-10-10-10z" />
          </svg>
        </a>
      </div>

      {/* Dashboard Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Dashboard Example</h2>
        <p className="text-gray-600 mb-6">
          A typical dashboard layout using shadcn/ui Card components. All widgets are draggable and resizable.
        </p>
        <div className="mb-4 p-3 bg-green-50 rounded-md text-green-700">
          <strong>Current Breakpoint:</strong> <span className="font-mono text-lg">{dashboardBreakpoint}</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridContainer
            layouts={dashboardLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            rowHeight={80}
            gap={16}
            onLayoutChange={(layout, layouts) => setDashboardLayouts(layouts)}
            onBreakpointChange={(breakpoint) => setDashboardBreakpoint(breakpoint)}
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
          <strong>Current Breakpoint:</strong> <span className="font-mono text-lg">{responsiveBreakpoint}</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridContainer
            layouts={responsiveLayouts}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            onLayoutChange={(layout, layouts) => setResponsiveLayouts(layouts)}
            onBreakpointChange={(breakpoint, _cols) => {
              setResponsiveBreakpoint(breakpoint)
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