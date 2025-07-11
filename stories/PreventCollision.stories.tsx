import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { GridContainer } from '../src/components/GridContainer'
import { GridItem } from '../src/types'

const meta: Meta<typeof GridContainer> = {
  title: 'Features/PreventCollision',
  component: GridContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Demonstrates preventCollision behavior - when true, items cannot overlap with any other items'
      }
    }
  }
}

export default meta
type Story = StoryObj<typeof GridContainer>

// Prevent collision demo
export const PreventCollisionDemo: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 3, y: 0, w: 2, h: 2 },
      { id: '3', x: 6, y: 0, w: 2, h: 2, static: true },
      { id: '4', x: 0, y: 3, w: 3, h: 2 },
      { id: '5', x: 4, y: 3, w: 3, h: 2 }
    ])

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">preventCollision = true</h3>
        <p className="text-sm text-gray-600 mb-4">
          Items cannot move to positions that would cause collisions with other items.
          Try dragging items - they will be blocked from overlapping.
        </p>
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <GridContainer
            items={items}
            cols={12}
            rowHeight={60}
            gap={16}
            preventCollision={true}
            allowOverlap={false}
            onLayoutChange={setItems}
            className="bg-gray-50"
          >
            {(item) => (
              <div 
                className={`
                  p-4 rounded-lg flex items-center justify-center font-semibold text-white
                  ${item.static ? 'bg-red-500' : 'bg-blue-500'}
                  hover:shadow-lg transition-shadow cursor-move
                `}
              >
                {item.static ? 'Static' : `Item ${item.id}`}
              </div>
            )}
          </GridContainer>
        </div>
      </div>
    )
  }
}

// Allow collision demo
export const AllowCollisionDemo: Story = {
  render: () => {
    const [items, setItems] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 3, y: 0, w: 2, h: 2 },
      { id: '3', x: 6, y: 0, w: 2, h: 2, static: true },
      { id: '4', x: 0, y: 3, w: 3, h: 2 },
      { id: '5', x: 4, y: 3, w: 3, h: 2 }
    ])

    return (
      <div>
        <h3 className="text-lg font-semibold mb-4">preventCollision = false (default)</h3>
        <p className="text-sm text-gray-600 mb-4">
          Items will push other items out of the way when dragged.
          Try dragging items - they will rearrange automatically.
        </p>
        <div className="border-2 border-gray-300 rounded-lg p-4">
          <GridContainer
            items={items}
            cols={12}
            rowHeight={60}
            gap={16}
            preventCollision={false}
            allowOverlap={false}
            onLayoutChange={setItems}
            className="bg-gray-50"
          >
            {(item) => (
              <div 
                className={`
                  p-4 rounded-lg flex items-center justify-center font-semibold text-white
                  ${item.static ? 'bg-red-500' : 'bg-blue-500'}
                  hover:shadow-lg transition-shadow cursor-move
                `}
              >
                {item.static ? 'Static' : `Item ${item.id}`}
              </div>
            )}
          </GridContainer>
        </div>
      </div>
    )
  }
}

// Side by side comparison
export const ComparisonDemo: Story = {
  render: () => {
    const [itemsPrevent, setItemsPrevent] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 3, y: 0, w: 2, h: 2 },
      { id: '3', x: 6, y: 0, w: 2, h: 2 }
    ])
    
    const [itemsAllow, setItemsAllow] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 3, y: 0, w: 2, h: 2 },
      { id: '3', x: 6, y: 0, w: 2, h: 2 }
    ])

    return (
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-2">preventCollision = true</h3>
          <p className="text-sm text-gray-600 mb-4">Items cannot overlap</p>
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <GridContainer
              items={itemsPrevent}
              cols={6}
              rowHeight={60}
              gap={16}
              preventCollision={true}
              allowOverlap={false}
              onLayoutChange={setItemsPrevent}
              className="bg-gray-50"
            >
              {(item) => (
                <div className="bg-blue-500 p-4 rounded-lg flex items-center justify-center font-semibold text-white hover:shadow-lg transition-shadow cursor-move">
                  {item.id}
                </div>
              )}
            </GridContainer>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">preventCollision = false</h3>
          <p className="text-sm text-gray-600 mb-4">Items push each other</p>
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <GridContainer
              items={itemsAllow}
              cols={6}
              rowHeight={60}
              gap={16}
              preventCollision={false}
              allowOverlap={false}
              onLayoutChange={setItemsAllow}
              className="bg-gray-50"
            >
              {(item) => (
                <div className="bg-green-500 p-4 rounded-lg flex items-center justify-center font-semibold text-white hover:shadow-lg transition-shadow cursor-move">
                  {item.id}
                </div>
              )}
            </GridContainer>
          </div>
        </div>
      </div>
    )
  }
}