import React, { useState } from 'react'
import { GridContainer, GridItem } from '../src'

export function BasicExample() {
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
            <div className="grid-drag-handle cursor-move absolute top-2 left-2 p-1">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM7 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 2a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM17 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/>
              </svg>
            </div>
            Item {item.id}
          </div>
        )}
      </GridContainer>

      <div className="mt-8 p-4 bg-white rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Current Layout:</h2>
        <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
          {JSON.stringify(items, null, 2)}
        </pre>
      </div>
    </div>
  )
}