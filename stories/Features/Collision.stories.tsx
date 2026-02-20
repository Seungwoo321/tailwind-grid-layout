import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { useState } from 'react'
import { GridContainer } from '../../src'
import type { GridItem } from '../../src/types'

/**
 * 충돌(Collision) 동작을 제어하는 다양한 옵션을 테스트합니다.
 */
const meta: Meta<typeof GridContainer> = {
  title: 'Features/Collision',
  component: GridContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '아이템 간 충돌 처리 방식을 설명합니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onLayoutChange: fn(),
  },
}

export default meta
type Story = StoryObj<typeof meta>

const defaultItems: GridItem[] = [
  { id: '1', x: 0, y: 0, w: 3, h: 2 },
  { id: '2', x: 4, y: 0, w: 3, h: 2 },
  { id: '3', x: 8, y: 0, w: 3, h: 2 },
  { id: '4', x: 0, y: 3, w: 4, h: 2 },
  { id: '5', x: 5, y: 3, w: 4, h: 2 },
]

/**
 * ## preventCollision = false (기본값)
 *
 * 아이템을 드래그하면 다른 아이템들이 자동으로 밀려납니다.
 */
export const PushMode: Story = {
  args: {
    items: defaultItems,
    cols: 12,
    rowHeight: 60,
    gap: 16,
    preventCollision: false,
    allowOverlap: false,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items || defaultItems)

    return (
      <div>
        <div className="mb-4 p-3 bg-slate-100 rounded border border-slate-200">
          <h3 className="font-medium text-slate-700">Push Mode (Default)</h3>
          <p className="text-sm text-slate-500 mt-1">
            아이템을 드래그하면 충돌하는 다른 아이템들이 자동으로 밀려납니다.
          </p>
        </div>
        <GridContainer
          {...args}
          items={items}
          onLayoutChange={setItems}
          className="bg-slate-50 rounded"
        >
          {(item) => (
            <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 flex items-center justify-center text-sm overflow-auto">
              {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

/**
 * ## preventCollision = true
 *
 * 아이템을 드래그해도 다른 아이템을 밀어내지 않습니다.
 */
export const BlockMode: Story = {
  args: {
    items: defaultItems,
    cols: 12,
    rowHeight: 60,
    gap: 16,
    preventCollision: true,
    allowOverlap: false,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items || defaultItems)

    return (
      <div>
        <div className="mb-4 p-3 bg-slate-100 rounded border border-slate-200">
          <h3 className="font-medium text-slate-700">Block Mode (preventCollision)</h3>
          <p className="text-sm text-slate-500 mt-1">
            아이템은 빈 공간으로만 이동할 수 있습니다.
          </p>
        </div>
        <GridContainer
          {...args}
          items={items}
          onLayoutChange={setItems}
          className="bg-slate-50 rounded"
        >
          {(item) => (
            <div className="h-full bg-slate-600 text-slate-100 rounded border border-slate-500 flex items-center justify-center text-sm overflow-auto">
              {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

/**
 * ## allowOverlap = true
 *
 * 아이템들이 서로 겹칠 수 있습니다.
 */
export const OverlapMode: Story = {
  args: {
    items: [
      { id: '1', x: 0, y: 0, w: 4, h: 3 },
      { id: '2', x: 2, y: 1, w: 4, h: 3 },
      { id: '3', x: 4, y: 2, w: 4, h: 3 },
    ],
    cols: 12,
    rowHeight: 60,
    gap: 16,
    preventCollision: false,
    allowOverlap: true,
    compactType: null,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items!)

    return (
      <div>
        <div className="mb-4 p-3 bg-slate-100 rounded border border-slate-200">
          <h3 className="font-medium text-slate-700">Overlap Mode</h3>
          <p className="text-sm text-slate-500 mt-1">
            아이템들이 서로 겹칠 수 있습니다.
          </p>
        </div>
        <GridContainer
          {...args}
          items={items}
          onLayoutChange={setItems}
          className="bg-slate-50 rounded min-h-[400px]"
        >
          {(item) => (
            <div className="h-full bg-slate-500/90 text-slate-100 rounded border border-slate-400 flex items-center justify-center text-sm overflow-auto">
              {item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

const itemsWithStatic: GridItem[] = [
  { id: '1', x: 0, y: 0, w: 3, h: 2 },
  { id: '2', x: 4, y: 0, w: 3, h: 2 },
  { id: 'static', x: 4, y: 2, w: 4, h: 2, static: true },
  { id: '3', x: 0, y: 3, w: 3, h: 2 },
  { id: '4', x: 8, y: 3, w: 3, h: 2 },
]

/**
 * ## Static 아이템과의 충돌
 */
export const WithStaticItem: Story = {
  args: {
    items: itemsWithStatic,
    cols: 12,
    rowHeight: 60,
    gap: 16,
    preventCollision: true,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items || itemsWithStatic)

    return (
      <div>
        <div className="mb-4 p-3 bg-slate-100 rounded border border-slate-200">
          <h3 className="font-medium text-slate-700">Static Item</h3>
          <p className="text-sm text-slate-500 mt-1">
            Static 아이템(밝은색)은 움직이지 않습니다.
          </p>
        </div>
        <GridContainer
          {...args}
          items={items}
          onLayoutChange={setItems}
          className="bg-slate-50 rounded"
        >
          {(item) => (
            <div
              className={`h-full rounded border flex items-center justify-center text-sm ${
                item.static
                  ? 'bg-slate-300 text-slate-600 border-slate-400'
                  : 'bg-slate-700 text-slate-100 border-slate-600'
              }`}
            >
              {item.static ? 'Static' : item.id}
            </div>
          )}
        </GridContainer>
      </div>
    )
  },
}

/**
 * ## 비교: preventCollision true vs false
 */
export const Comparison: Story = {
  render: () => {
    const [itemsPrevent, setItemsPrevent] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 4, y: 0, w: 3, h: 2 },
      { id: '3', x: 8, y: 0, w: 3, h: 2 },
    ])

    const [itemsAllow, setItemsAllow] = useState<GridItem[]>([
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 4, y: 0, w: 3, h: 2 },
      { id: '3', x: 8, y: 0, w: 3, h: 2 },
    ])

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <div className="mb-3 p-2 bg-slate-100 rounded border border-slate-200">
            <h3 className="font-medium text-slate-700 text-sm">preventCollision = true</h3>
          </div>
          <GridContainer
            items={itemsPrevent}
            cols={6}
            rowHeight={60}
            gap={12}
            preventCollision={true}
            onLayoutChange={setItemsPrevent}
            className="bg-slate-50 rounded"
          >
            {(item) => (
              <div className="h-full bg-slate-600 text-slate-100 rounded border border-slate-500 flex items-center justify-center text-sm overflow-auto">
                {item.id}
              </div>
            )}
          </GridContainer>
        </div>

        <div>
          <div className="mb-3 p-2 bg-slate-100 rounded border border-slate-200">
            <h3 className="font-medium text-slate-700 text-sm">preventCollision = false</h3>
          </div>
          <GridContainer
            items={itemsAllow}
            cols={6}
            rowHeight={60}
            gap={12}
            preventCollision={false}
            onLayoutChange={setItemsAllow}
            className="bg-slate-50 rounded"
          >
            {(item) => (
              <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 flex items-center justify-center text-sm overflow-auto">
                {item.id}
              </div>
            )}
          </GridContainer>
        </div>
      </div>
    )
  },
}
