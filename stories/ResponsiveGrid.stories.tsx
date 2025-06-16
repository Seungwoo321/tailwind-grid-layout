import type { Meta, StoryObj } from '@storybook/react'
import { ResponsiveGridContainer } from '../src'
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
    })

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <div className="mb-4">
          <h1 className="text-2xl font-bold mb-2">Responsive Grid Example</h1>
          <p className="text-gray-600">Resize your browser window to see the grid adapt to different breakpoints</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Breakpoints: xs: 480px, sm: 768px, md: 996px, lg: 1200px</p>
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