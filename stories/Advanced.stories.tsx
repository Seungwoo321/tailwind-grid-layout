import type { Meta, StoryObj } from '@storybook/react'
import { GridContainer } from '../src'
import type { GridItem } from '../src'
import { useState } from 'react'

const meta = {
  title: 'Examples/Advanced',
  component: GridContainer,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GridContainer>

export default meta
type Story = StoryObj<typeof meta>

export const FullFeatured: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 6 },
      { id: '2', x: 4, y: 0, w: 4, h: 2, static: true },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
      { id: '4', x: 0, y: 2, w: 6, h: 3 },
      { id: '5', x: 6, y: 2, w: 6, h: 3 },
    ])

    const [compactType, setCompactType] = useState<'vertical' | 'horizontal' | null>('vertical')
    const [preventCollision, setPreventCollision] = useState(false)
    const [isDraggable, setIsDraggable] = useState(true)
    const [isResizable, setIsResizable] = useState(true)
    const [resizeHandles, setResizeHandles] = useState(['se'])

    const addNewItem = () => {
      const newId = (Math.max(...items.map(i => parseInt(i.id))) + 1).toString()
      setItems([...items, {
        id: newId,
        x: 0,
        y: 0,
        w: 2,
        h: 2
      }])
    }

    const removeItem = (id: string) => {
      setItems(items.filter(item => item.id !== id))
    }

    const toggleHandle = (handle: string) => {
      setResizeHandles(prev => 
        prev.includes(handle) 
          ? prev.filter(h => h !== handle)
          : [...prev, handle]
      )
    }

    return (
      <div className="p-4 bg-gray-50 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Advanced Grid Example</h1>
        
        {/* Controls */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Grid Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Compact Type */}
            <div>
              <label className="block text-sm font-medium mb-1">Compact Type:</label>
              <select 
                value={compactType || 'none'} 
                onChange={(e) => setCompactType(e.target.value === 'none' ? null : e.target.value as any)}
                className="w-full px-3 py-1 border rounded"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
                <option value="none">None</option>
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={preventCollision}
                  onChange={(e) => setPreventCollision(e.target.checked)}
                />
                <span className="text-sm">Prevent Collision</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isDraggable}
                  onChange={(e) => setIsDraggable(e.target.checked)}
                />
                <span className="text-sm">Draggable</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isResizable}
                  onChange={(e) => setIsResizable(e.target.checked)}
                />
                <span className="text-sm">Resizable</span>
              </label>
            </div>

            {/* Resize Handles */}
            <div>
              <label className="block text-sm font-medium mb-1">Resize Handles:</label>
              <div className="grid grid-cols-4 gap-1 text-xs">
                {['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'].map(handle => (
                  <label key={handle} className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={resizeHandles.includes(handle)}
                      onChange={() => toggleHandle(handle)}
                    />
                    <span>{handle}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={addNewItem}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add New Item
          </button>
        </div>

        {/* Grid */}
        <GridContainer
          items={items}
          cols={12}
          rowHeight={60}
          gap={16}
          margin={[16, 16]}
          maxRows={10}
          compactType={compactType}
          preventCollision={preventCollision}
          isDraggable={isDraggable}
          isResizable={isResizable}
          resizeHandles={resizeHandles as any}
          onLayoutChange={setItems}
          className="bg-white rounded-lg shadow-sm"
        >
          {(item) => (
            <div className={`h-full rounded-lg shadow-md flex flex-col ${
              item.static ? 'bg-gray-400' : 'bg-gradient-to-br from-purple-500 to-pink-500'
            }`}>
              <div className="grid-drag-handle cursor-move p-2 bg-black/10 rounded-t-lg flex items-center justify-between">
                <span className="text-white font-semibold">Item {item.id}</span>
                {!item.static && (
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white hover:text-red-200 grid-actions"
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex-1 p-4 text-white text-sm">
                {item.static && <p>Static Item</p>}
                <p>Position: ({item.x}, {item.y})</p>
                <p>Size: {item.w} × {item.h}</p>
              </div>
            </div>
          )}
        </GridContainer>

        {/* Layout Info */}
        <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Current Layout:</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto max-h-48">
            {JSON.stringify(items, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}