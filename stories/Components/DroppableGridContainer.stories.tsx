import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { useState } from 'react'
import { DroppableGridContainer } from '../../src/components/DroppableGridContainer'
import type { GridItem } from '../../src/types'
import { Card, CardContent, CardHeader, CardTitle } from '../../src/components/ui/card'

/**
 * DroppableGridContainer는 외부에서 아이템을 드래그하여 그리드에 추가할 수 있는 컨테이너입니다.
 */
const meta: Meta<typeof DroppableGridContainer> = {
  title: 'Components/DroppableGridContainer',
  component: DroppableGridContainer,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: '외부 드래그 앤 드롭을 지원하는 그리드 컨테이너입니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onLayoutChange: fn(),
    onDrop: fn(),
    onDragStart: fn(),
    onDrag: fn(),
    onDragStop: fn(),
    onResizeStart: fn(),
    onResize: fn(),
    onResizeStop: fn(),
  },
  argTypes: {
    cols: {
      control: { type: 'number', min: 1, max: 24 },
      description: '그리드 컬럼 수',
    },
    rowHeight: {
      control: { type: 'number', min: 20, max: 200 },
      description: '행 높이',
    },
    gap: {
      control: { type: 'number', min: 0, max: 50 },
      description: '아이템 간 간격',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

interface Widget {
  id: string
  name: string
  w: number
  h: number
  color: string
}

const availableWidgets: Widget[] = [
  { id: 'chart', name: 'Chart Widget', w: 4, h: 3, color: 'bg-slate-700' },
  { id: 'stats', name: 'Stats Widget', w: 2, h: 2, color: 'bg-slate-600' },
  { id: 'list', name: 'List Widget', w: 3, h: 4, color: 'bg-slate-800' },
  { id: 'media', name: 'Media Widget', w: 3, h: 3, color: 'bg-slate-500' },
]

/**
 * 기본 드래그 앤 드롭 예제입니다.
 * 왼쪽 패널에서 위젯을 드래그하여 그리드에 추가하세요.
 */
export const Default: Story = {
  args: {
    cols: 12,
    rowHeight: 60,
    gap: 16,
  },
  render: (args) => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 3, y: 0, w: 3, h: 2 },
    ])

    const handleDrop = (newItem: GridItem) => {
      setItems([...items, newItem])
    }

    const handleDragStart = (e: React.DragEvent, widget: Widget) => {
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({
          id: `${widget.id}-${Date.now()}`,
          w: widget.w,
          h: widget.h,
          color: widget.color,
          name: widget.name,
        })
      )
      e.dataTransfer.effectAllowed = 'copy'
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Drag and Drop Example</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Widget Palette */}
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
                    <CardHeader className="p-3">
                      <CardTitle className="text-sm">{widget.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className={`h-12 ${widget.color} rounded`} />
                      <p className="text-xs text-muted-foreground mt-2">
                        Size: {widget.w} x {widget.h}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Drag widgets to the grid area
            </p>
          </div>

          {/* Grid Area */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold mb-3">Grid Area</h2>
            <DroppableGridContainer
              {...args}
              items={items}
              onLayoutChange={setItems}
              onDrop={handleDrop}
              className="bg-white rounded-lg shadow-sm min-h-[400px]"
            >
              {(item) => {
                const widget = availableWidgets.find((w) => item.id.startsWith(w.id))
                const color = widget?.color || 'bg-slate-700'
                const name = widget?.name || `Widget ${item.id}`

                return (
                  <div className={`h-full ${color} text-slate-100 rounded border border-slate-600 p-4`}>
                    <h3 className="font-semibold">{name}</h3>
                    <p className="text-sm opacity-80">
                      ({item.x}, {item.y}) - {item.w}x{item.h}
                    </p>
                  </div>
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

/**
 * 드롭 프리뷰가 활성화된 예제입니다.
 */
export const WithDropPreview: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
    ])
    const [isDragging, setIsDragging] = useState(false)
    const [draggedSize, setDraggedSize] = useState<{ w: number; h: number } | null>(null)

    const sizes = [
      { label: 'Small', w: 2, h: 2 },
      { label: 'Medium', w: 4, h: 2 },
      { label: 'Large', w: 6, h: 3 },
    ]

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Drop Preview Example</h1>

        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <h2 className="font-semibold mb-3">Draggable Items</h2>
          <div className="flex gap-3">
            {sizes.map((size) => (
              <div
                key={size.label}
                draggable
                onDragStart={(e) => {
                  setIsDragging(true)
                  setDraggedSize({ w: size.w, h: size.h })
                  e.dataTransfer.setData(
                    'application/json',
                    JSON.stringify({
                      id: `item-${Date.now()}`,
                      w: size.w,
                      h: size.h,
                    })
                  )
                }}
                onDragEnd={() => {
                  setIsDragging(false)
                  setDraggedSize(null)
                }}
                className="px-4 py-3 bg-slate-700 text-slate-100 rounded border border-slate-600 cursor-move hover:bg-slate-600 transition-colors"
              >
                {size.label} ({size.w}x{size.h})
              </div>
            ))}
          </div>
        </div>

        <DroppableGridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          droppingItem={isDragging && draggedSize ? draggedSize : undefined}
          onLayoutChange={setItems}
          onDrop={(newItem) => setItems([...items, newItem])}
          className="bg-white rounded-lg shadow min-h-[400px]"
        >
          {(item) => (
            <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 p-4 flex items-center justify-center">
              <span className="font-semibold">Item {item.id}</span>
            </div>
          )}
        </DroppableGridContainer>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> A preview placeholder appears while dragging over the grid,
            showing where the item will be placed.
          </p>
        </div>
      </div>
    )
  },
}

/**
 * 아이템 삭제가 가능한 예제입니다.
 */
export const WithRemove: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
      { id: '2', x: 4, y: 0, w: 4, h: 2 },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
    ])

    const removeItem = (id: string) => {
      setItems(items.filter((item) => item.id !== id))
    }

    const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData(
        'application/json',
        JSON.stringify({
          id: `new-${Date.now()}`,
          w: 3,
          h: 2,
        })
      )
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Removable Items</h1>

        <div className="mb-4">
          <div
            draggable
            onDragStart={handleDragStart}
            className="inline-block px-4 py-2 bg-slate-700 text-slate-100 rounded border border-slate-600 cursor-move hover:bg-slate-600"
          >
            + Drag to add new item
          </div>
        </div>

        <DroppableGridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          onLayoutChange={setItems}
          onDrop={(newItem) => setItems([...items, newItem])}
          className="bg-white rounded-lg shadow min-h-[300px]"
        >
          {(item) => (
            <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 p-4 relative group">
              <button
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 w-6 h-6 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              <div className="flex items-center justify-center h-full font-semibold">
                Item {item.id}
              </div>
            </div>
          )}
        </DroppableGridContainer>
      </div>
    )
  },
}
