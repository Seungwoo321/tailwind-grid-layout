import type { Meta, StoryObj } from '@storybook/react'
import { fn, within, expect } from '@storybook/test'
import { useState, useEffect } from 'react'
import { GridContainer } from '../../src'
import type { GridItem } from '../../src/types'

/**
 * GridContainer는 드래그 앤 드롭, 리사이즈가 가능한 그리드 레이아웃 컨테이너입니다.
 *
 * React Grid Layout API와 호환되며, Tailwind CSS를 사용하여 스타일링됩니다.
 */
const meta: Meta<typeof GridContainer> = {
  title: 'Components/GridContainer',
  component: GridContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '드래그, 리사이즈가 가능한 그리드 레이아웃 컨테이너입니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onLayoutChange: fn(),
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
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '12' },
      },
    },
    rowHeight: {
      control: { type: 'number', min: 20, max: 200 },
      description: '행 높이 (픽셀)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '60' },
      },
    },
    gap: {
      control: { type: 'number', min: 0, max: 50 },
      description: '아이템 간 간격 (픽셀)',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '16' },
      },
    },
    isDraggable: {
      control: 'boolean',
      description: '드래그 활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    isResizable: {
      control: 'boolean',
      description: '리사이즈 활성화 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    preventCollision: {
      control: 'boolean',
      description: '충돌 방지 모드 - true일 때 아이템이 다른 아이템을 밀어내지 않음',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    allowOverlap: {
      control: 'boolean',
      description: '아이템 겹침 허용 여부',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    compactType: {
      control: 'select',
      options: ['vertical', 'horizontal', null],
      description: '압축 방향',
      table: {
        type: { summary: "'vertical' | 'horizontal' | null" },
        defaultValue: { summary: "'vertical'" },
      },
    },
    autoSize: {
      control: 'boolean',
      description: '컨테이너 높이 자동 조정',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'true' },
      },
    },
    maxRows: {
      control: { type: 'number', min: 1, max: 100 },
      description: '최대 행 수',
      table: {
        type: { summary: 'number' },
      },
    },
    resizeHandles: {
      control: 'check',
      options: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'],
      description: '리사이즈 핸들 위치',
      table: {
        type: { summary: "Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>" },
        defaultValue: { summary: "['se']" },
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// 기본 아이템
const defaultItems: GridItem[] = [
  { id: '1', x: 0, y: 0, w: 4, h: 2 },
  { id: '2', x: 4, y: 0, w: 4, h: 2 },
  { id: '3', x: 8, y: 0, w: 4, h: 2 },
  { id: '4', x: 0, y: 2, w: 6, h: 2 },
  { id: '5', x: 6, y: 2, w: 6, h: 2 },
]

// 렌더링 헬퍼 컴포넌트
const GridContainerWithState = (props: React.ComponentProps<typeof GridContainer>) => {
  const [items, setItems] = useState(props.items)

  useEffect(() => {
    setItems(props.items)
  }, [props.items])

  return (
    <GridContainer
      {...props}
      items={items}
      onLayoutChange={setItems}
    >
      {(item) => (
        <div
          className="h-full bg-slate-700 rounded border border-slate-600 flex items-center justify-center text-slate-100 text-sm"
          data-testid={`grid-item-${item.id}`}
        >
          {item.id}
        </div>
      )}
    </GridContainer>
  )
}

/**
 * 기본 그리드 레이아웃입니다.
 * Controls 패널에서 다양한 옵션을 조정해보세요.
 */
export const Default: Story = {
  args: {
    items: defaultItems,
    cols: 12,
    rowHeight: 60,
    gap: 16,
    isDraggable: true,
    isResizable: true,
    preventCollision: false,
    allowOverlap: false,
    compactType: 'vertical',
    autoSize: true,
    resizeHandles: ['se'],
    className: 'bg-gray-100 rounded-lg',
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 드래그가 비활성화된 그리드입니다.
 */
export const DragDisabled: Story = {
  args: {
    ...Default.args,
    isDraggable: false,
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 리사이즈가 비활성화된 그리드입니다.
 */
export const ResizeDisabled: Story = {
  args: {
    ...Default.args,
    isResizable: false,
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 8방향 리사이즈 핸들이 활성화된 그리드입니다.
 */
export const AllResizeHandles: Story = {
  args: {
    ...Default.args,
    resizeHandles: ['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne'],
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 충돌 방지 모드가 활성화된 그리드입니다.
 * 아이템을 드래그해도 다른 아이템을 밀어내지 않습니다.
 */
export const PreventCollision: Story = {
  args: {
    ...Default.args,
    preventCollision: true,
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 압축 없이 자유 배치가 가능한 그리드입니다.
 */
export const NoCompaction: Story = {
  args: {
    ...Default.args,
    compactType: null,
    items: [
      { id: '1', x: 0, y: 0, w: 3, h: 2 },
      { id: '2', x: 5, y: 2, w: 3, h: 2 },
      { id: '3', x: 9, y: 4, w: 3, h: 2 },
    ],
  },
  render: (args) => <GridContainerWithState {...args} />,
}

/**
 * 수평 압축 모드입니다.
 */
export const HorizontalCompact: Story = {
  args: {
    ...Default.args,
    compactType: 'horizontal',
    items: [
      { id: '1', x: 2, y: 0, w: 2, h: 3 },
      { id: '2', x: 6, y: 0, w: 2, h: 3 },
      { id: '3', x: 10, y: 0, w: 2, h: 3 },
    ],
  },
  render: (args) => <GridContainerWithState {...args} />,
}

// Static 아이템 포함
const itemsWithStatic: GridItem[] = [
  { id: '1', x: 0, y: 0, w: 4, h: 2 },
  { id: '2', x: 4, y: 0, w: 4, h: 2, static: true },
  { id: '3', x: 8, y: 0, w: 4, h: 2 },
  { id: '4', x: 0, y: 2, w: 6, h: 2 },
  { id: '5', x: 6, y: 2, w: 6, h: 2, static: true },
]

/**
 * Static 아이템이 포함된 그리드입니다.
 * Static 아이템(회색)은 드래그/리사이즈가 불가능합니다.
 */
export const WithStaticItems: Story = {
  args: {
    ...Default.args,
    items: itemsWithStatic,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items || itemsWithStatic)

    return (
      <GridContainer
        {...args}
        items={items}
        onLayoutChange={setItems}
      >
        {(item) => (
          <div
            className={`h-full rounded border flex items-center justify-center text-sm ${
              item.static
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed border-slate-400'
                : 'bg-slate-700 text-slate-100 border-slate-600'
            }`}
          >
            {item.static ? 'Static' : item.id}
          </div>
        )}
      </GridContainer>
    )
  },
}

// Min/Max 제약 조건 아이템
const itemsWithConstraints: GridItem[] = [
  { id: '1', x: 0, y: 0, w: 4, h: 2, minW: 2, minH: 2, maxW: 6 },
  { id: '2', x: 4, y: 0, w: 4, h: 2, minW: 3, maxH: 4 },
  { id: '3', x: 8, y: 0, w: 4, h: 2, minW: 2, minH: 1, maxW: 8, maxH: 6 },
]

/**
 * Min/Max 크기 제약이 있는 아이템입니다.
 */
export const WithConstraints: Story = {
  args: {
    ...Default.args,
    items: itemsWithConstraints,
  },
  render: (args) => {
    const [items, setItems] = useState(args.items || itemsWithConstraints)

    return (
      <GridContainer
        {...args}
        items={items}
        onLayoutChange={setItems}
      >
        {(item) => (
          <div className="h-full bg-slate-700 rounded border border-slate-600 p-3 text-slate-100">
            <div className="text-sm">{item.id}</div>
            <div className="text-xs mt-1 text-slate-400 space-y-0.5">
              {item.minW && <div>minW: {item.minW}</div>}
              {item.minH && <div>minH: {item.minH}</div>}
              {item.maxW && <div>maxW: {item.maxW}</div>}
              {item.maxH && <div>maxH: {item.maxH}</div>}
            </div>
          </div>
        )}
      </GridContainer>
    )
  },
}

/**
 * 인터랙션 테스트가 포함된 스토리입니다.
 */
export const InteractionTest: Story = {
  args: {
    ...Default.args,
    items: [
      { id: 'test-1', x: 0, y: 0, w: 4, h: 2 },
      { id: 'test-2', x: 4, y: 0, w: 4, h: 2 },
    ],
  },
  render: (args) => <GridContainerWithState {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    // 아이템이 렌더링되었는지 확인
    const item1 = canvas.getByTestId('grid-item-test-1')
    const item2 = canvas.getByTestId('grid-item-test-2')

    await expect(item1).toBeInTheDocument()
    await expect(item2).toBeInTheDocument()

    // 아이템 텍스트 확인
    await expect(item1).toHaveTextContent('Item test-1')
    await expect(item2).toHaveTextContent('Item test-2')
  },
}
