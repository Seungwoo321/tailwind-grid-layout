import type { Meta, StoryObj } from '@storybook/react'
import { GridContainer } from '../src'
import type { GridItem } from '../src'
import { useState } from 'react'

const meta = {
  title: 'Components/GridContainer',
  component: GridContainer,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GridContainer>

export default meta
type Story = StoryObj<typeof meta>

// Basic example
export const Basic: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 },
      { id: '3', x: 4, y: 0, w: 2, h: 2 },
      { id: '4', x: 0, y: 2, w: 3, h: 3 },
      { id: '5', x: 3, y: 2, w: 3, h: 3 },
    ])

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Basic Grid Example</h1>
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className="h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
              Item {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

// With min/max constraints
export const WithConstraints: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 6 },
      { id: '2', x: 4, y: 0, w: 4, h: 2, minW: 3, maxH: 4 },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
    ])

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">With Min/Max Constraints</h1>
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className="h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-md p-4 text-white">
              <div className="font-semibold">Item {item.id}</div>
              <div className="text-sm mt-1">
                {item.minW && <div>Min Width: {item.minW}</div>}
                {item.minH && <div>Min Height: {item.minH}</div>}
                {item.maxW && <div>Max Width: {item.maxW}</div>}
                {item.maxH && <div>Max Height: {item.maxH}</div>}
              </div>
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

// Static items
export const WithStaticItems: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
      { id: '2', x: 4, y: 0, w: 4, h: 2, static: true },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
      { id: '4', x: 0, y: 2, w: 6, h: 3 },
      { id: '5', x: 6, y: 2, w: 6, h: 3, static: true },
    ])

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">With Static Items</h1>
        <p className="mb-4 text-gray-600">Gray items are static and cannot be moved or resized</p>
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className={`h-full rounded-lg shadow-md flex items-center justify-center text-white font-semibold ${
              item.static ? 'bg-gray-400' : 'bg-gradient-to-br from-green-500 to-teal-600'
            }`}>
              {item.static ? 'Static' : 'Draggable'} Item {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

// Different compaction types
export const CompactionTypes: Story = {
  render: () => {
    const [compactType, setCompactType] = useState<'vertical' | 'horizontal' | null>('vertical')
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 4, y: 0, w: 2, h: 2 },
      { id: '3', x: 8, y: 0, w: 2, h: 2 },
      { id: '4', x: 2, y: 4, w: 3, h: 2 },
      { id: '5', x: 6, y: 6, w: 3, h: 2 },
    ])

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Compaction Types</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Compaction Type:</label>
          <select 
            value={compactType || 'none'} 
            onChange={(e) => setCompactType(e.target.value === 'none' ? null : e.target.value as any)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="vertical">Vertical</option>
            <option value="horizontal">Horizontal</option>
            <option value="none">None</option>
          </select>
        </div>
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          compactType={compactType}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className="h-full bg-gradient-to-br from-orange-500 to-red-600 rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
              Item {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

// Prevent collision
export const PreventCollision: Story = {
  render: () => {
    const [preventCollision, setPreventCollision] = useState(false)
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 4 },
      { id: '2', x: 4, y: 0, w: 4, h: 4 },
      { id: '3', x: 8, y: 0, w: 4, h: 4 },
    ])

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Prevent Collision</h1>
        <div className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preventCollision}
              onChange={(e) => setPreventCollision(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm font-medium">Prevent Collision</span>
          </label>
        </div>
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          preventCollision={preventCollision}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className="h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-md flex items-center justify-center text-white font-semibold">
              Item {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}