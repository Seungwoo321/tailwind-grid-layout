import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { GridContainer, DroppableGridContainer } from '../src'
import type { GridItem } from '../src/types'

const meta = {
  title: 'Features/AutoSize & DroppingItem',
  component: GridContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GridContainer>

export default meta
type Story = StoryObj<typeof meta>

export const AutoSizeDemo: Story = {
  name: 'AutoSize Feature',
  render: () => {
    const [autoSize, setAutoSize] = useState(true)
    const [items] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
      { id: '2', x: 4, y: 0, w: 4, h: 3 },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
      { id: '4', x: 0, y: 3, w: 6, h: 2 },
      { id: '5', x: 6, y: 3, w: 6, h: 2 }
    ])

    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">AutoSize Demo</h2>
        <p className="mb-4">
          When autoSize is true, the container height adjusts automatically to fit all items.
          When false, you need to set a fixed height.
        </p>
        
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoSize}
              onChange={(e) => setAutoSize(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Enable autoSize</span>
          </label>
        </div>

        <div className={!autoSize ? 'h-96 overflow-auto' : ''}>
          <GridContainer
            items={items}
            autoSize={autoSize}
            rowHeight={60}
            className="border-2 border-gray-300"
            style={!autoSize ? { height: '100%' } : undefined}
          >
            {(item) => (
              <div className="bg-blue-500 text-white p-4 rounded h-full flex items-center justify-center">
                Item {item.id}
              </div>
            )}
          </GridContainer>
        </div>
      </div>
    )
  }
}

export const DroppingItemDemo: Story = {
  name: 'DroppingItem Preview',
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
      { id: '2', x: 4, y: 0, w: 4, h: 2 }
    ])
    
    const [isDragging, setIsDragging] = useState(false)

    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">DroppingItem Preview</h2>
        <p className="mb-4">
          The droppingItem prop shows a preview of where the item will be placed when dragging from outside.
        </p>

        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Draggable Items:</h3>
          <div className="flex gap-2">
            {['Small (2x2)', 'Medium (4x2)', 'Large (6x3)'].map((size, index) => (
              <div
                key={size}
                draggable
                onDragStart={() => setIsDragging(true)}
                onDragEnd={() => setIsDragging(false)}
                className="p-3 bg-green-500 text-white rounded cursor-move hover:bg-green-600"
                data-size={[
                  { w: 2, h: 2 },
                  { w: 4, h: 2 },
                  { w: 6, h: 3 }
                ][index]}
              >
                {size}
              </div>
            ))}
          </div>
        </div>

        <DroppableGridContainer
          items={items}
          onDrop={(newItem) => {
            setItems([...items, newItem])
          }}
          droppingItem={isDragging ? { w: 4, h: 2 } : undefined}
          rowHeight={60}
          className="border-2 border-gray-300 min-h-[400px]"
        >
          {(item) => (
            <div className="bg-purple-500 text-white p-4 rounded h-full flex items-center justify-center">
              Item {item.id}
            </div>
          )}
        </DroppableGridContainer>
      </div>
    )
  }
}

export const CombinedDemo: Story = {
  name: 'AutoSize + DroppingItem',
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 3, y: 0, w: 3, h: 2 }
    ])
    
    const [autoSize, setAutoSize] = useState(true)
    const [draggedSize, setDraggedSize] = useState<{ w: number; h: number } | null>(null)

    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Combined Features: AutoSize + DroppingItem</h2>
        <p className="mb-4">
          This demo shows how autoSize and droppingItem work together. Drag items from below to the grid.
        </p>
        
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoSize}
              onChange={(e) => setAutoSize(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Enable autoSize</span>
          </label>
        </div>

        <div className="mb-4 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Drag these items to the grid:</h3>
          <div className="flex gap-2">
            {[
              { label: 'Small (2x2)', size: { w: 2, h: 2 } },
              { label: 'Medium (3x2)', size: { w: 3, h: 2 } },
              { label: 'Large (4x3)', size: { w: 4, h: 3 } }
            ].map((item) => (
              <div
                key={item.label}
                draggable
                onDragStart={(e) => {
                  setDraggedSize(item.size)
                  e.dataTransfer.setData('application/json', JSON.stringify({
                    id: `new-${Date.now()}`,
                    ...item.size
                  }))
                }}
                onDragEnd={() => setDraggedSize(null)}
                className="p-3 bg-green-500 text-white rounded cursor-move hover:bg-green-600"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>

        <div className={!autoSize ? 'h-96 overflow-auto' : ''}>
          <DroppableGridContainer
            items={items}
            autoSize={autoSize}
            droppingItem={draggedSize || { w: 3, h: 2 }}
            rowHeight={60}
            className="border-2 border-gray-300"
            style={!autoSize ? { height: '100%' } : undefined}
            onLayoutChange={(newLayout) => setItems(newLayout)}
            onDrop={(newItem) => {
              setItems([...items, newItem])
            }}
          >
            {(item) => (
              <div className="bg-indigo-500 text-white p-4 rounded h-full flex items-center justify-center">
                {item.id}
              </div>
            )}
          </DroppableGridContainer>
        </div>

        <div className="mt-4 p-4 bg-blue-50 rounded">
          <p className="text-sm text-gray-600">
            <strong>Note:</strong> The dropping preview only appears when you're actually dragging an item over the grid.
            The preview shows where the item will be placed.
          </p>
        </div>
      </div>
    )
  }
}