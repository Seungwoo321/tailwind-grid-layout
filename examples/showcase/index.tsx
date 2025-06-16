import React, { useState } from 'react'
import { GridContainer, ResponsiveGridContainer } from '../../src'
import type { GridItem, BreakpointLayouts } from '../../src'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../src/components/ui/card'

export function ShowcaseExample() {
  // Basic Dashboard Example
  const [dashboardItems, setDashboardItems] = useState<GridItem[]>([
    { id: 'stats', x: 0, y: 0, w: 3, h: 2 },
    { id: 'chart', x: 3, y: 0, w: 6, h: 4 },
    { id: 'recent', x: 9, y: 0, w: 3, h: 4 },
    { id: 'table', x: 0, y: 2, w: 3, h: 4 },
    { id: 'timeline', x: 3, y: 4, w: 9, h: 3 },
  ])

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
          <GridContainer
            items={dashboardItems}
            cols={12}
            rowHeight={80}
            gap={16}
            onLayoutChange={setDashboardItems}
          >
            {renderDashboardItem}
          </GridContainer>
        </div>
      </section>

      {/* Responsive Grid Example */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Responsive Breakpoints</h2>
        <p className="text-gray-600 mb-6">
          The grid automatically adapts to different screen sizes. Try resizing your browser window.
        </p>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ResponsiveGridContainer
            layouts={responsiveLayouts}
            onLayoutChange={(layout, layouts) => setResponsiveLayouts(layouts)}
            rowHeight={100}
            gap={16}
          >
            {renderResponsiveItem}
          </ResponsiveGridContainer>
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