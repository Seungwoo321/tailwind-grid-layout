import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { ResponsiveGridContainer, WidthProvider, generateLayouts, generateResponsiveLayouts } from '../../src'
import type { GridItem } from '../../src/types'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

/**
 * 레이아웃 생성 및 관리를 위한 유틸리티 함수들입니다.
 */
const meta: Meta<typeof ResponsiveGridContainer> = {
  title: 'Utilities/Layout Utils',
  component: ResponsiveGridContainer,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: '레이아웃 생성 유틸리티 함수와 WidthProvider HOC를 설명합니다.',
      },
    },
  },
  tags: ['autodocs'],
  args: {
    onLayoutChange: fn(),
    onBreakpointChange: fn(),
  },
}

export default meta
type Story = StoryObj

const sampleItems: GridItem[] = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 6 },
  { id: 'main', x: 3, y: 2, w: 9, h: 6 },
  { id: 'footer', x: 0, y: 8, w: 12, h: 2 },
]

/**
 * ## generateLayouts
 *
 * 단일 레이아웃을 모든 브레이크포인트에 동일하게 적용합니다.
 *
 * ```ts
 * const layouts = generateLayouts(items)
 * // { lg: items, md: items, sm: items, xs: items, xxs: items }
 * ```
 */
export const GenerateLayouts: Story = {
  render: () => {
    const layouts = generateLayouts(sampleItems)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">generateLayouts</h2>
          <p className="text-gray-600 mb-4">
            단일 레이아웃을 모든 브레이크포인트에 동일하게 적용합니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Code</h3>
          <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`const items = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 6 },
  { id: 'main', x: 3, y: 2, w: 9, h: 6 },
  { id: 'footer', x: 0, y: 8, w: 12, h: 2 },
]

const layouts = generateLayouts(items)
// Result: { lg: items, md: items, sm: items, xs: items, xxs: items }`}
          </pre>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Result</h3>
          <ResponsiveGridWithWidth
            layouts={layouts}
            rowHeight={40}
            gap={8}
            className="bg-white rounded-lg shadow"
          >
            {(item) => (
              <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 flex items-center justify-center text-sm overflow-auto">
                {item.id}
              </div>
            )}
          </ResponsiveGridWithWidth>
        </div>

        <details className="bg-gray-50 rounded-lg p-4">
          <summary className="cursor-pointer font-semibold">View generated layouts</summary>
          <pre className="mt-2 text-xs overflow-auto max-h-60">
            {JSON.stringify(layouts, null, 2)}
          </pre>
        </details>
      </div>
    )
  },
}

/**
 * ## generateResponsiveLayouts
 *
 * 브레이크포인트별 컬럼 수에 맞게 레이아웃을 자동 조정합니다.
 *
 * ```ts
 * const layouts = generateResponsiveLayouts(items, {
 *   lg: 12, md: 10, sm: 6, xs: 4, xxs: 2
 * })
 * ```
 */
export const GenerateResponsiveLayouts: Story = {
  render: () => {
    const colsConfig = { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }
    const layouts = generateResponsiveLayouts(sampleItems, colsConfig)

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">generateResponsiveLayouts</h2>
          <p className="text-gray-600 mb-4">
            브레이크포인트별 컬럼 수에 맞게 아이템 크기와 위치를 자동 조정합니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Code</h3>
          <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`const items = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 6 },
  { id: 'main', x: 3, y: 2, w: 9, h: 6 },
]

const layouts = generateResponsiveLayouts(items, {
  lg: 12,  // Desktop
  md: 10,  // Tablet landscape
  sm: 6,   // Tablet portrait
  xs: 4,   // Mobile landscape
  xxs: 2   // Mobile portrait
})`}
          </pre>
        </div>

        <div className="p-3 bg-yellow-50 border border-yellow-300 rounded-lg">
          <p className="text-sm">
            <strong>Tip:</strong> 브라우저 창 크기를 조절하여 반응형 동작을 확인하세요!
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Result</h3>
          <ResponsiveGridWithWidth
            layouts={layouts}
            cols={colsConfig}
            rowHeight={40}
            gap={8}
            className="bg-white rounded-lg shadow"
          >
            {(item) => (
              <div className="h-full bg-slate-600 text-slate-100 rounded border border-slate-500 flex items-center justify-center text-sm overflow-auto">
                {item.id}
              </div>
            )}
          </ResponsiveGridWithWidth>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Breakpoint Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(layouts).map(([bp, items]) => (
              <div key={bp} className="p-3 bg-gray-100 rounded">
                <h4 className="font-semibold text-sm">
                  {bp} ({colsConfig[bp as keyof typeof colsConfig]} cols)
                </h4>
                <ul className="text-xs mt-1 space-y-0.5">
                  {items.map((item) => (
                    <li key={item.id}>
                      {item.id}: w={item.w}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * ## WidthProvider
 *
 * 컨테이너 너비를 자동으로 감지하는 HOC입니다.
 *
 * ```tsx
 * const ResponsiveGrid = WidthProvider(ResponsiveGridContainer)
 *
 * <ResponsiveGrid layouts={layouts} ... />
 * ```
 */
export const WidthProviderDemo: Story = {
  render: () => {
    const layouts = generateLayouts([
      { id: '1', x: 0, y: 0, w: 4, h: 2 },
      { id: '2', x: 4, y: 0, w: 4, h: 2 },
      { id: '3', x: 8, y: 0, w: 4, h: 2 },
    ])

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">WidthProvider HOC</h2>
          <p className="text-gray-600 mb-4">
            컨테이너 너비를 자동으로 감지하여 ResponsiveGridContainer에 전달합니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Code</h3>
          <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`import { ResponsiveGridContainer, WidthProvider } from 'tailwind-grid-layout'

// HOC로 감싸기
const ResponsiveGrid = WidthProvider(ResponsiveGridContainer)

// 사용
<ResponsiveGrid
  layouts={layouts}
  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
>
  {(item) => <div>...</div>}
</ResponsiveGrid>`}
          </pre>
        </div>

        <div className="border-2 border-purple-300 p-4 rounded-lg">
          <p className="text-sm text-purple-600 mb-3">
            아래 그리드는 부모 컨테이너 너비를 자동 감지합니다.
          </p>
          <ResponsiveGridWithWidth
            layouts={layouts}
            rowHeight={60}
            gap={12}
            className="bg-white rounded shadow"
          >
            {(item) => (
              <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 flex items-center justify-center text-sm overflow-auto">
                {item.id}
              </div>
            )}
          </ResponsiveGridWithWidth>
        </div>
      </div>
    )
  },
}

/**
 * ## measureBeforeMount
 *
 * 마운트 전 너비를 측정하여 레이아웃 시프트를 방지합니다.
 */
export const MeasureBeforeMount: Story = {
  render: () => {
    const ResponsiveGridMeasured = WidthProvider(ResponsiveGridContainer)
    const layouts = generateLayouts([
      { id: 'A', x: 0, y: 0, w: 4, h: 2 },
      { id: 'B', x: 4, y: 0, w: 4, h: 2 },
      { id: 'C', x: 8, y: 0, w: 4, h: 2 },
    ])

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">measureBeforeMount</h2>
          <p className="text-gray-600 mb-4">
            마운트 전에 컨테이너 너비를 측정하여 초기 레이아웃 시프트를 방지합니다.
          </p>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Code</h3>
          <pre className="text-sm bg-white p-3 rounded overflow-x-auto">
{`<ResponsiveGrid
  measureBeforeMount
  layouts={layouts}
  ...
/>`}
          </pre>
        </div>

        <ResponsiveGridMeasured
          measureBeforeMount
          layouts={layouts}
          rowHeight={80}
          gap={12}
          className="bg-white rounded-lg shadow"
        >
          {(item) => (
            <div className="h-full bg-slate-700 text-slate-100 rounded border border-slate-600 flex items-center justify-center text-lg overflow-auto">
              {item.id}
            </div>
          )}
        </ResponsiveGridMeasured>
      </div>
    )
  },
}
