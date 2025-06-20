import type { Meta, StoryObj } from '@storybook/react'
import { ResponsiveGridContainer, WidthProvider } from '../src'
import type { BreakpointLayouts } from '../src'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'

const meta = {
  title: 'Components/ResponsiveGridContainer',
  component: ResponsiveGridContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResponsiveGridContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [layouts, setLayouts] = useState<BreakpointLayouts>({
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

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Responsive Grid Example</h1>
          <p className="text-gray-600">Resize your browser window to see the grid adapt to different breakpoints</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Breakpoints: xxs: 0px, xs: 480px, sm: 768px, md: 996px, lg: 1200px</p>
          </div>
        </div>
        
        <ResponsiveGridContainer
          layouts={layouts}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
          rowHeight={80}
          gap={16}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Widget {item.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Position: ({item.x}, {item.y})<br />
                  Size: {item.w} × {item.h}
                </p>
              </CardContent>
            </Card>
          )}
        </ResponsiveGridContainer>
      </div>
    )
  },
}

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

    const [layouts, setLayouts] = useState<BreakpointLayouts>({
      desktop: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 4, y: 0, w: 8, h: 3 },
        { id: '3', x: 12, y: 0, w: 4, h: 3 },
      ],
      tablet: [
        { id: '1', x: 0, y: 0, w: 8, h: 3 },
        { id: '2', x: 0, y: 3, w: 8, h: 3 },
        { id: '3', x: 0, y: 6, w: 8, h: 3 },
      ],
      mobile: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 0, y: 3, w: 4, h: 4 },
        { id: '3', x: 0, y: 7, w: 4, h: 3 },
      ],
    })

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Custom Breakpoints Example</h1>
          <p className="text-gray-600">Using custom breakpoints: mobile (320px), tablet (768px), desktop (1440px)</p>
        </div>
        
        <ResponsiveGridContainer
          layouts={layouts}
          breakpoints={customBreakpoints}
          cols={customCols}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
          rowHeight={60}
          gap={16}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 text-white">
              <h3 className="font-semibold mb-2">Widget {item.id}</h3>
              <p className="text-sm opacity-90">
                Responsive content that adapts to screen size
              </p>
            </div>
          )}
        </ResponsiveGridContainer>
      </div>
    )
  },
}

export const WithBreakpointIndicator: Story = {
  render: () => {
    const [layouts, setLayouts] = useState<BreakpointLayouts>({
      lg: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 4, y: 0, w: 4, h: 3 },
        { id: '3', x: 8, y: 0, w: 4, h: 3 },
        { id: '4', x: 0, y: 3, w: 6, h: 2 },
        { id: '5', x: 6, y: 3, w: 6, h: 2 },
      ],
      md: [
        { id: '1', x: 0, y: 0, w: 5, h: 3 },
        { id: '2', x: 5, y: 0, w: 5, h: 3 },
        { id: '3', x: 0, y: 3, w: 10, h: 2 },
        { id: '4', x: 0, y: 5, w: 5, h: 2 },
        { id: '5', x: 5, y: 5, w: 5, h: 2 },
      ],
      sm: [
        { id: '1', x: 0, y: 0, w: 6, h: 3 },
        { id: '2', x: 0, y: 3, w: 6, h: 3 },
        { id: '3', x: 0, y: 6, w: 6, h: 2 },
        { id: '4', x: 0, y: 8, w: 3, h: 2 },
        { id: '5', x: 3, y: 8, w: 3, h: 2 },
      ],
      xs: [
        { id: '1', x: 0, y: 0, w: 4, h: 3 },
        { id: '2', x: 0, y: 3, w: 4, h: 3 },
        { id: '3', x: 0, y: 6, w: 4, h: 2 },
        { id: '4', x: 0, y: 8, w: 4, h: 2 },
        { id: '5', x: 0, y: 10, w: 4, h: 2 },
      ],
      xxs: [
        { id: '1', x: 0, y: 0, w: 2, h: 3 },
        { id: '2', x: 0, y: 3, w: 2, h: 3 },
        { id: '3', x: 0, y: 6, w: 2, h: 2 },
        { id: '4', x: 0, y: 8, w: 2, h: 2 },
        { id: '5', x: 0, y: 10, w: 2, h: 2 },
      ],
    })

    const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
    const [currentCols, setCurrentCols] = useState(12)

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">With Breakpoint Indicator</h1>
          <p className="text-gray-600 mb-4">
            This example shows the current breakpoint and column count in real-time
          </p>
          
          {/* Breakpoint Indicator */}
          <div className="mb-4 p-4 bg-blue-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-blue-700">Current Breakpoint:</span>
                <span className="ml-2 text-2xl font-bold text-blue-900">{currentBreakpoint.toUpperCase()}</span>
              </div>
              <div>
                <span className="text-sm font-semibold text-blue-700">Columns:</span>
                <span className="ml-2 text-2xl font-bold text-blue-900">{currentCols}</span>
              </div>
            </div>
            <div className="mt-2 text-sm text-blue-600">
              <div className="flex gap-4">
                <span className={currentBreakpoint === 'lg' ? 'font-bold' : ''}>lg: ≥1200px (12 cols)</span>
                <span className={currentBreakpoint === 'md' ? 'font-bold' : ''}>md: ≥996px (10 cols)</span>
                <span className={currentBreakpoint === 'sm' ? 'font-bold' : ''}>sm: ≥768px (6 cols)</span>
                <span className={currentBreakpoint === 'xs' ? 'font-bold' : ''}>xs: ≥480px (4 cols)</span>
                <span className={currentBreakpoint === 'xxs' ? 'font-bold' : ''}>xxs: ≥0px (2 cols)</span>
              </div>
            </div>
          </div>
        </div>
        
        <ResponsiveGridContainer
          layouts={layouts}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
          onBreakpointChange={(breakpoint, cols) => {
            setCurrentBreakpoint(breakpoint)
            setCurrentCols(cols)
            console.log(`Breakpoint changed to: ${breakpoint} (${cols} columns)`)
          }}
          rowHeight={80}
          gap={16}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">Widget {item.id}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {currentBreakpoint}: {item.w}×{item.h}
                </p>
              </CardContent>
            </Card>
          )}
        </ResponsiveGridContainer>
      </div>
    )
  },
}

export const WithWidthProvider: Story = {
  render: () => {
    const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)
    
    const [layouts, setLayouts] = useState<BreakpointLayouts>({
      lg: [
        { id: 'stats', x: 0, y: 0, w: 3, h: 2 },
        { id: 'chart', x: 3, y: 0, w: 6, h: 4 },
        { id: 'list', x: 9, y: 0, w: 3, h: 4 },
        { id: 'info', x: 0, y: 2, w: 3, h: 2 },
      ],
      md: [
        { id: 'stats', x: 0, y: 0, w: 5, h: 2 },
        { id: 'chart', x: 5, y: 0, w: 5, h: 4 },
        { id: 'list', x: 0, y: 4, w: 5, h: 3 },
        { id: 'info', x: 5, y: 4, w: 5, h: 3 },
      ],
      sm: [
        { id: 'stats', x: 0, y: 0, w: 6, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 6, h: 4 },
        { id: 'list', x: 0, y: 6, w: 6, h: 3 },
        { id: 'info', x: 0, y: 9, w: 6, h: 2 },
      ],
      xs: [
        { id: 'stats', x: 0, y: 0, w: 4, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 4, h: 4 },
        { id: 'list', x: 0, y: 6, w: 4, h: 3 },
        { id: 'info', x: 0, y: 9, w: 4, h: 2 },
      ],
      xxs: [
        { id: 'stats', x: 0, y: 0, w: 2, h: 2 },
        { id: 'chart', x: 0, y: 2, w: 2, h: 4 },
        { id: 'list', x: 0, y: 6, w: 2, h: 3 },
        { id: 'info', x: 0, y: 9, w: 2, h: 2 },
      ],
    })

    const [breakpointInfo, setBreakpointInfo] = useState({ breakpoint: 'lg', cols: 12 })

    const widgetContent: Record<string, { title: string; color: string; icon: string }> = {
      stats: { title: 'Statistics', color: 'from-blue-500 to-blue-600', icon: '📊' },
      chart: { title: 'Analytics Chart', color: 'from-green-500 to-green-600', icon: '📈' },
      list: { title: 'Recent Items', color: 'from-purple-500 to-purple-600', icon: '📋' },
      info: { title: 'Information', color: 'from-orange-500 to-orange-600', icon: 'ℹ️' },
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">With WidthProvider HOC</h1>
          <p className="text-gray-600 mb-2">
            WidthProvider automatically detects container width using ResizeObserver
          </p>
          <div className="p-3 bg-green-50 rounded-md text-green-700 text-sm">
            <strong>Benefits:</strong> No manual width tracking • Better performance • SSR compatible with measureBeforeMount
          </div>
          <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
            Current: <strong>{breakpointInfo.breakpoint.toUpperCase()}</strong> ({breakpointInfo.cols} columns)
          </div>
        </div>
        
        <ResponsiveGridWithWidth
          layouts={layouts}
          onLayoutChange={(layout, layouts) => setLayouts(layouts)}
          onBreakpointChange={(breakpoint, cols) => {
            setBreakpointInfo({ breakpoint, cols })
          }}
          rowHeight={80}
          gap={16}
          measureBeforeMount={true}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => {
            const content = widgetContent[item.id] || { title: item.id, color: 'from-gray-500 to-gray-600', icon: '📦' }
            return (
              <div className={`h-full bg-gradient-to-br ${content.color} rounded-lg shadow-md p-4 text-white`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-lg">{content.title}</h3>
                  <span className="text-2xl">{content.icon}</span>
                </div>
                <p className="text-sm opacity-90">
                  Size: {item.w} × {item.h}
                </p>
              </div>
            )
          }}
        </ResponsiveGridWithWidth>
      </div>
    )
  },
}

export const InteractiveBreakpoints: Story = {
  render: () => {
    const [layouts] = useState<BreakpointLayouts>({
      lg: [
        { id: '1', x: 0, y: 0, w: 6, h: 4 },
        { id: '2', x: 6, y: 0, w: 6, h: 2 },
        { id: '3', x: 6, y: 2, w: 6, h: 2 },
      ],
      md: [
        { id: '1', x: 0, y: 0, w: 10, h: 4 },
        { id: '2', x: 0, y: 4, w: 5, h: 2 },
        { id: '3', x: 5, y: 4, w: 5, h: 2 },
      ],
      sm: [
        { id: '1', x: 0, y: 0, w: 6, h: 4 },
        { id: '2', x: 0, y: 4, w: 6, h: 2 },
        { id: '3', x: 0, y: 6, w: 6, h: 2 },
      ],
      xs: [
        { id: '1', x: 0, y: 0, w: 4, h: 4 },
        { id: '2', x: 0, y: 4, w: 4, h: 2 },
        { id: '3', x: 0, y: 6, w: 4, h: 2 },
      ],
      xxs: [
        { id: '1', x: 0, y: 0, w: 2, h: 4 },
        { id: '2', x: 0, y: 4, w: 2, h: 2 },
        { id: '3', x: 0, y: 6, w: 2, h: 2 },
      ],
    })

    const [selectedBreakpoint, setSelectedBreakpoint] = useState<'lg' | 'md' | 'sm' | 'xs' | 'xxs'>('lg')
    const [containerWidth, setContainerWidth] = useState(1200)

    const breakpointWidths = {
      lg: 1200,
      md: 996,
      sm: 768,
      xs: 480,
      xxs: 320,
    }

    const handleBreakpointSelect = (bp: typeof selectedBreakpoint) => {
      setSelectedBreakpoint(bp)
      setContainerWidth(breakpointWidths[bp])
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Interactive Breakpoint Testing</h1>
          <p className="text-gray-600 mb-4">
            Click the buttons below to simulate different screen sizes without resizing your browser
          </p>
          
          {/* Breakpoint Selector */}
          <div className="flex gap-2 mb-4">
            {Object.entries(breakpointWidths).map(([bp, width]) => (
              <button
                key={bp}
                onClick={() => handleBreakpointSelect(bp as typeof selectedBreakpoint)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${
                  selectedBreakpoint === bp
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {bp.toUpperCase()} ({width}px)
              </button>
            ))}
          </div>
          
          <div className="p-3 bg-yellow-50 rounded-md text-yellow-800 text-sm mb-4">
            <strong>Note:</strong> This simulates different container widths. The grid will respond as if the container was {containerWidth}px wide.
          </div>
        </div>
        
        <div style={{ width: '100%', maxWidth: `${containerWidth}px`, margin: '0 auto' }}>
          <ResponsiveGridContainer
            layouts={layouts}
            width={containerWidth}
            rowHeight={60}
            gap={16}
            className="bg-white rounded-lg shadow-sm"
            isDraggable={false}
            isResizable={false}
          >
            {(item) => (
              <div className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md p-4 text-white flex flex-col items-center justify-center">
                <h3 className="font-bold text-2xl mb-2">Widget {item.id}</h3>
                <p className="text-sm opacity-90">
                  {selectedBreakpoint.toUpperCase()}: {item.w} × {item.h}
                </p>
              </div>
            )}
          </ResponsiveGridContainer>
        </div>
      </div>
    )
  },
}