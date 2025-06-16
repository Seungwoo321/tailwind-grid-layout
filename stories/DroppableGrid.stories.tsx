import type { Meta, StoryObj } from '@storybook/react'
import { DroppableGridContainer } from '../src/components/DroppableGridContainer'
import type { GridItem } from '../src'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../src/components/ui/card'

const meta = {
  title: 'Components/DroppableGridContainer',
  component: DroppableGridContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof DroppableGridContainer>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 3, y: 0, w: 3, h: 2 },
    ])

    const handleDrop = (newItem: GridItem) => {
      setItems([...items, newItem])
    }

    const availableWidgets = [
      { id: 'chart', name: 'Chart Widget', w: 4, h: 3, color: 'from-blue-500 to-blue-600' },
      { id: 'stats', name: 'Stats Widget', w: 2, h: 2, color: 'from-green-500 to-green-600' },
      { id: 'list', name: 'List Widget', w: 3, h: 4, color: 'from-purple-500 to-purple-600' },
      { id: 'media', name: 'Media Widget', w: 3, h: 3, color: 'from-orange-500 to-orange-600' },
    ]

    const handleDragStart = (e: React.DragEvent, widget: any) => {
      e.dataTransfer.setData('application/json', JSON.stringify({
        id: `${widget.id}-${Date.now()}`,
        ...widget,
      }))
      e.dataTransfer.effectAllowed = 'copy'
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Drag and Drop Example</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Available Widgets */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold mb-3">Available Widgets</h2>
            <div className="space-y-2">
              {availableWidgets.map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, widget)}
                  className="cursor-move"
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <CardTitle className="text-sm">{widget.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className={`h-16 bg-gradient-to-br ${widget.color} rounded`} />
                      <p className="text-xs text-muted-foreground mt-2">
                        Size: {widget.w}×{widget.h}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Drag widgets to the grid area →
            </p>
          </div>

          {/* Grid Area */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-3">Grid Area</h2>
            <DroppableGridContainer
              items={items}
              cols={12}
              rowHeight={60}
              gap={16}
              onLayoutChange={setItems}
              onDrop={handleDrop}
              className="bg-white rounded-lg shadow-sm min-h-[400px]"
            >
              {(item) => {
                const widget = availableWidgets.find(w => item.id.startsWith(w.id))
                const color = widget?.color || 'from-gray-500 to-gray-600'
                const name = widget?.name || `Widget ${item.id}`
                
                return (
                  <Card className="h-full">
                    <div className={`h-full bg-gradient-to-br ${color} text-white rounded-lg`}>
                      <CardHeader>
                        <CardTitle className="text-white">{name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/80">
                          Position: ({item.x}, {item.y})
                        </p>
                      </CardContent>
                    </div>
                  </Card>
                )
              }}
            </DroppableGridContainer>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">How to use:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Drag any widget from the left panel</li>
            <li>Drop it onto the grid area</li>
            <li>The widget will be placed at the drop location</li>
            <li>After dropping, you can drag and resize widgets within the grid</li>
          </ol>
        </div>
      </div>
    )
  },
}