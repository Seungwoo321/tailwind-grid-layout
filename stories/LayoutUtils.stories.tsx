import type { Meta, StoryObj } from '@storybook/react'
import { ResponsiveGridContainer, WidthProvider, generateLayouts, generateResponsiveLayouts } from '../src'
import type { GridItem } from '../src/types'

const ResponsiveGridWithWidth = WidthProvider(ResponsiveGridContainer)

const meta = {
  title: 'Utils/Layout Utilities',
  component: ResponsiveGridContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ResponsiveGridContainer>

export default meta
type Story = StoryObj<typeof meta>

// Sample items for demos
const sampleItems: GridItem[] = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 8 },
  { id: 'main', x: 3, y: 2, w: 9, h: 8 },
  { id: 'footer', x: 0, y: 10, w: 12, h: 2 }
]

export const GenerateLayouts: Story = {
  name: 'generateLayouts Utility',
  render: () => {
    // Generate identical layouts for all breakpoints
    const layouts = generateLayouts(sampleItems)
    
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">generateLayouts Example</h2>
        <p className="mb-4">
          This utility creates identical layouts for all breakpoints from a single layout definition.
          Perfect for when you want the same layout across all screen sizes.
        </p>
        
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold mb-2">Code:</h3>
          <pre className="text-sm">
{`const items = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 8 },
  { id: 'main', x: 3, y: 2, w: 9, h: 8 },
  { id: 'footer', x: 0, y: 10, w: 12, h: 2 }
]

const layouts = generateLayouts(items)
// Result: { lg: items, md: items, sm: items, xs: items, xxs: items }`}
          </pre>
        </div>
        
        <ResponsiveGridContainer
          layouts={layouts}
          rowHeight={60}
          className="border-2 border-gray-300"
        >
          {(item) => (
            <div className="bg-blue-500 text-white p-4 rounded flex items-center justify-center">
              {item.id}
            </div>
          )}
        </ResponsiveGridContainer>
        
        <details className="mt-4">
          <summary className="cursor-pointer font-semibold">View generated layouts</summary>
          <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
            {JSON.stringify(layouts, null, 2)}
          </pre>
        </details>
      </div>
    )
  }
}

export const GenerateResponsiveLayouts: Story = {
  name: 'generateResponsiveLayouts Utility',
  render: () => {
    // Generate responsive layouts that adapt to different column counts
    const layouts = generateResponsiveLayouts(sampleItems, {
      lg: 12,
      md: 10,
      sm: 6,
      xs: 4,
      xxs: 2
    })
    
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">generateResponsiveLayouts Example</h2>
        <p className="mb-4">
          This utility automatically adjusts layouts to fit different column counts per breakpoint.
          Items are resized and repositioned to fit within the available columns.
        </p>
        
        <div className="mb-4 p-4 bg-green-50 rounded">
          <h3 className="font-semibold mb-2">Code:</h3>
          <pre className="text-sm">
{`const items = [
  { id: 'header', x: 0, y: 0, w: 12, h: 2 },  // Full width
  { id: 'sidebar', x: 0, y: 2, w: 3, h: 8 }, // 1/4 width
  { id: 'main', x: 3, y: 2, w: 9, h: 8 },    // 3/4 width
]

const layouts = generateResponsiveLayouts(items, {
  lg: 12,  // Desktop: original layout
  md: 10,  // Tablet: items adjust to fit 10 cols
  sm: 6,   // Mobile: sidebar becomes full width
  xs: 4,   // Small mobile: everything stacks
  xxs: 2   // Tiny screens: minimal columns
})`}
          </pre>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded">
          <p className="text-sm">
            <strong>Note:</strong> Resize your browser to see how items automatically adjust to different column counts!
          </p>
        </div>
        
        <ResponsiveGridContainer
          layouts={layouts}
          rowHeight={60}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          className="border-2 border-gray-300"
        >
          {(item) => (
            <div className="bg-green-500 text-white p-4 rounded flex items-center justify-center">
              {item.id}
            </div>
          )}
        </ResponsiveGridContainer>
        
        <div className="mt-4">
          <h3 className="font-bold mb-2">How it works:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(layouts).map(([bp, items]) => (
              <div key={bp} className="p-3 bg-gray-100 rounded">
                <h4 className="font-semibold">{bp} ({
                  { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }[bp]
                } cols):</h4>
                <ul className="text-xs mt-1 space-y-1">
                  {items.map(item => (
                    <li key={item.id}>
                      {item.id}: x={item.x}, w={item.w}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export const WithWidthProvider: Story = {
  name: 'WidthProvider HOC',
  render: () => {
    const layouts = generateLayouts([
      { id: '1', x: 0, y: 0, w: 6, h: 2 },
      { id: '2', x: 6, y: 0, w: 6, h: 2 },
      { id: '3', x: 0, y: 2, w: 4, h: 2 },
      { id: '4', x: 4, y: 2, w: 4, h: 2 },
      { id: '5', x: 8, y: 2, w: 4, h: 2 }
    ])
    
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">WidthProvider Example</h2>
        <p className="mb-4">
          WidthProvider automatically measures the container width and provides it to ResponsiveGridContainer.
          Resize your browser to see the responsive behavior.
        </p>
        
        <div className="border-2 border-purple-300 p-4 rounded">
          <ResponsiveGridWithWidth
            layouts={layouts}
            rowHeight={60}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            className="border border-gray-200"
          >
            {(item) => (
              <div className="bg-purple-500 text-white p-4 rounded flex items-center justify-center">
                Item {item.id}
              </div>
            )}
          </ResponsiveGridWithWidth>
        </div>
      </div>
    )
  }
}

export const MeasureBeforeMount: Story = {
  name: 'WidthProvider with measureBeforeMount',
  render: () => {
    const ResponsiveGridMeasured = WidthProvider(ResponsiveGridContainer)
    const layouts = generateLayouts([
      { id: 'A', x: 0, y: 0, w: 4, h: 2 },
      { id: 'B', x: 4, y: 0, w: 4, h: 2 },
      { id: 'C', x: 8, y: 0, w: 4, h: 2 }
    ])
    
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">measureBeforeMount Option</h2>
        <p className="mb-4">
          With measureBeforeMount=true, the component waits to measure container width before rendering,
          eliminating any layout shift on mount.
        </p>
        
        <ResponsiveGridMeasured
          measureBeforeMount
          layouts={layouts}
          rowHeight={80}
          className="border-2 border-orange-300"
        >
          {(item) => (
            <div className="bg-orange-500 text-white p-4 rounded flex items-center justify-center text-2xl font-bold">
              {item.id}
            </div>
          )}
        </ResponsiveGridMeasured>
      </div>
    )
  }
}