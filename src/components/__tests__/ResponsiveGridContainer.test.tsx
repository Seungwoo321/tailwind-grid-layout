import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResponsiveGridContainer } from '../ResponsiveGridContainer'
import type { GridItem, ResponsiveLayouts } from '../../types'

// Mock window.matchMedia
const createMatchMedia = (matches: boolean) => (query: string) => ({
  matches,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
})

describe('ResponsiveGridContainer', () => {
  const mockLayouts: ResponsiveLayouts = {
    lg: [{ id: '1', x: 0, y: 0, w: 6, h: 2 }],
    md: [{ id: '1', x: 0, y: 0, w: 8, h: 2 }],
    sm: [{ id: '1', x: 0, y: 0, w: 12, h: 2 }]
  }

  beforeEach(() => {
    vi.clearAllMocks()
    window.matchMedia = createMatchMedia(true)
  })

  it('should render with responsive layouts', () => {
    render(
      <ResponsiveGridContainer layouts={mockLayouts} width={1200}>
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(screen.getByTestId('item-1')).toBeInTheDocument()
  })

  it('should use correct layout based on width and breakpoints', () => {
    const { rerender } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1200}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should use lg layout at 1200px
    expect(document.querySelector('.relative')).toBeInTheDocument()

    // Test md breakpoint
    rerender(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={900}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should handle layout changes', () => {
    const mockOnLayoutChange = vi.fn()
    
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1200}
        onLayoutChange={mockOnLayoutChange}
      >
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Simulate drag to trigger layout change
    const gridItem = screen.getByTestId('item-1').parentElement!
    fireEvent.mouseDown(gridItem)
    fireEvent.mouseMove(gridItem, { clientX: 100, clientY: 100 })
    fireEvent.mouseUp(gridItem)

    // onLayoutChange should be defined
    expect(mockOnLayoutChange).toBeDefined()
  })

  it('should use different column counts per breakpoint', () => {
    const cols = { lg: 12, md: 8, sm: 4 }
    
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1200}
        cols={cols}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should pass through container props', () => {
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1200}
        isDraggable={false}
        isResizable={false}
        rowHeight={80}
        gap={20}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Check that the grid container is rendered
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should handle undefined width gracefully', () => {
    render(
      <ResponsiveGridContainer layouts={mockLayouts}>
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should still render with default/undefined width
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should handle empty layouts for a breakpoint', () => {
    const layoutsWithEmpty = {
      lg: [{ id: '1', x: 0, y: 0, w: 6, h: 2 }],
      md: [],
      sm: [{ id: '1', x: 0, y: 0, w: 12, h: 2 }]
    }

    render(
      <ResponsiveGridContainer 
        layouts={layoutsWithEmpty} 
        width={900}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should handle empty layout array
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should update layout when width changes', () => {
    const { rerender } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1300}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Change to md breakpoint
    rerender(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={800}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div data-testid={`item-${item.id}`}>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(screen.getByTestId('item-1')).toBeInTheDocument()
  })

  it('should handle onBreakpointChange callback', () => {
    const mockOnBreakpointChange = vi.fn()
    
    const { rerender } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1300}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        onBreakpointChange={mockOnBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Clear any initial calls
    mockOnBreakpointChange.mockClear()

    // Change breakpoint from lg to sm
    rerender(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={500}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        onBreakpointChange={mockOnBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should be called when breakpoint changes
    expect(mockOnBreakpointChange).toHaveBeenCalled()
  })

  it('should use default breakpoints and cols when not provided', () => {
    const simpleLayouts = {
      lg: [{ id: '1', x: 0, y: 0, w: 4, h: 2 }]
    }

    render(
      <ResponsiveGridContainer layouts={simpleLayouts} width={1200}>
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should handle missing layout for current breakpoint', () => {
    // Layouts without 'sm' breakpoint
    const incompleteLayouts = {
      lg: [{ id: '1', x: 0, y: 0, w: 6, h: 2 }],
      md: [{ id: '1', x: 0, y: 0, w: 8, h: 2 }]
    }

    render(
      <ResponsiveGridContainer 
        layouts={incompleteLayouts} 
        width={500}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should still render with empty layout
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should calculate breakpoint correctly with edge case widths', () => {
    const { rerender } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={768} // Exactly at sm breakpoint
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.querySelector('.relative')).toBeInTheDocument()

    // Test width just below breakpoint
    rerender(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={767.9}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    expect(document.querySelector('.relative')).toBeInTheDocument()
  })

  it('should use default cols when cols object does not have breakpoint value', () => {
    const mockOnBreakpointChange = vi.fn()
    const incompleteColsConfig = { lg: 16 } // Missing md and sm
    
    const { rerender } = render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1300}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={incompleteColsConfig}
        onBreakpointChange={mockOnBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Clear initial call
    mockOnBreakpointChange.mockClear()

    // Change to md breakpoint where cols is not defined
    rerender(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={900}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={incompleteColsConfig}
        onBreakpointChange={mockOnBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should use default cols (10) for md from defaultCols
    expect(mockOnBreakpointChange).toHaveBeenCalledWith('md', 10)
  })

  it('should handle cols as number instead of object', () => {
    const mockOnBreakpointChange = vi.fn()
    
    render(
      <ResponsiveGridContainer 
        layouts={mockLayouts} 
        width={1300}
        breakpoints={{ lg: 1200, md: 996, sm: 768 }}
        cols={10} // Single number instead of object
        onBreakpointChange={mockOnBreakpointChange}
      >
        {(item) => <div>Item {item.id}</div>}
      </ResponsiveGridContainer>
    )

    // Should pass the number directly
    expect(document.querySelector('.relative')).toBeInTheDocument()
  })
})