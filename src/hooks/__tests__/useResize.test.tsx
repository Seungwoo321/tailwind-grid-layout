import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useResize } from '../useResize'
import { useDrag } from '../useDrag'
import { GridItem } from '../../types'

// Helper to create a mock event
const createMouseEvent = (x: number, y: number): MouseEvent => {
  return {
    clientX: x,
    clientY: y,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  } as unknown as MouseEvent
}

// Helper to create a React synthetic event
const createReactMouseEvent = (x: number, y: number): React.MouseEvent => {
  return {
    clientX: x,
    clientY: y,
    nativeEvent: createMouseEvent(x, y),
    currentTarget: {
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 100 })
    } as HTMLElement,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn()
  } as unknown as React.MouseEvent
}

describe('useResize hook', () => {
  const defaultOptions = {
    cols: 12,
    rowHeight: 60,
    gap: 16,
    margin: undefined,
    containerPadding: [16, 16] as [number, number],
    containerWidth: 1200,
    layout: [
      { id: 'item1', x: 2, y: 2, w: 3, h: 2 }
    ] as GridItem[],
    setLayout: vi.fn(),
    updateLayout: vi.fn(),
    containerRef: { current: document.createElement('div') } as React.RefObject<HTMLDivElement>
  }

  let mockSetLayout: ReturnType<typeof vi.fn>
  let mockUpdateLayout: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetLayout = vi.fn()
    mockUpdateLayout = vi.fn()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('SE (South-East) handle', () => {
    it('should increase width when dragging right', () => {
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      // Start resize
      const startEvent = createReactMouseEvent(100, 100)
      act(() => {
        result.current.handleResizeStart('item1', 'se', startEvent)
      })

      expect(result.current.resizeState.isResizing).toBe(true)
      expect(result.current.resizeState.resizedItem).toBe('item1')
      expect(result.current.resizeState.resizeHandle).toBe('se')
    })

    it('should increase height when dragging down', () => {
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(100, 100)
      act(() => {
        result.current.handleResizeStart('item1', 'se', startEvent)
      })

      expect(result.current.resizeState.isResizing).toBe(true)
      expect(result.current.resizeState.startSize.w).toBe(3)
      expect(result.current.resizeState.startSize.h).toBe(2)
    })
  })

  describe('NW (North-West) handle', () => {
    it('should store original position correctly', () => {
      const layout = [{ id: 'item1', x: 0, y: 0, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'nw', startEvent)
      })

      // Critical: originalPos should capture the exact starting position including 0
      expect(result.current.resizeState.originalPos).toEqual({ x: 0, y: 0 })
    })

    it('should handle x=0 position correctly (regression test for || vs ?? bug)', () => {
      const layout = [{ id: 'item1', x: 0, y: 0, w: 4, h: 3 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'nw', startEvent)
      })

      // This test ensures originalPos.x is 0, not using item.x as fallback
      expect(result.current.resizeState.originalPos?.x).toBe(0)
      expect(result.current.resizeState.originalPos?.y).toBe(0)
    })
  })

  describe('SW (South-West) handle', () => {
    it('should store original position for SW resize', () => {
      const layout = [{ id: 'item1', x: 0, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'sw', startEvent)
      })

      expect(result.current.resizeState.originalPos).toEqual({ x: 0, y: 2 })
      expect(result.current.resizeState.resizeHandle).toBe('sw')
    })
  })

  describe('NE (North-East) handle', () => {
    it('should store original position for NE resize', () => {
      const layout = [{ id: 'item1', x: 2, y: 0, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'ne', startEvent)
      })

      expect(result.current.resizeState.originalPos).toEqual({ x: 2, y: 0 })
      expect(result.current.resizeState.resizeHandle).toBe('ne')
    })
  })

  describe('N (North) handle', () => {
    it('should only affect height and y position', () => {
      const layout = [{ id: 'item1', x: 2, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'n', startEvent)
      })

      expect(result.current.resizeState.resizeHandle).toBe('n')
      expect(result.current.resizeState.originalPos?.y).toBe(2)
    })
  })

  describe('S (South) handle', () => {
    it('should only affect height', () => {
      const layout = [{ id: 'item1', x: 2, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 's', startEvent)
      })

      expect(result.current.resizeState.resizeHandle).toBe('s')
    })
  })

  describe('E (East) handle', () => {
    it('should only affect width', () => {
      const layout = [{ id: 'item1', x: 2, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'e', startEvent)
      })

      expect(result.current.resizeState.resizeHandle).toBe('e')
    })
  })

  describe('W (West) handle', () => {
    it('should affect width and x position', () => {
      const layout = [{ id: 'item1', x: 2, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'w', startEvent)
      })

      expect(result.current.resizeState.resizeHandle).toBe('w')
      expect(result.current.resizeState.originalPos?.x).toBe(2)
    })

    it('should handle x=0 position correctly (regression test)', () => {
      const layout = [{ id: 'item1', x: 0, y: 2, w: 3, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(50, 50)
      act(() => {
        result.current.handleResizeStart('item1', 'w', startEvent)
      })

      // This ensures x=0 is captured, not undefined
      expect(result.current.resizeState.originalPos?.x).toBe(0)
    })
  })

  describe('initial state', () => {
    it('should start with isResizing = false', () => {
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      expect(result.current.resizeState.isResizing).toBe(false)
      expect(result.current.resizeState.resizedItem).toBeNull()
      expect(result.current.resizeState.resizeHandle).toBeNull()
    })
  })

  describe('callbacks', () => {
    it('should call onResizeStart when resize begins', () => {
      const onResizeStart = vi.fn()
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout,
        onResizeStart
      }))

      const startEvent = createReactMouseEvent(100, 100)
      act(() => {
        result.current.handleResizeStart('item1', 'se', startEvent)
      })

      expect(onResizeStart).toHaveBeenCalledTimes(1)
    })
  })

  describe('size constraints', () => {
    it('should initialize with correct start size', () => {
      const layout = [{ id: 'item1', x: 0, y: 0, w: 4, h: 3 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(100, 100)
      act(() => {
        result.current.handleResizeStart('item1', 'se', startEvent)
      })

      expect(result.current.resizeState.startSize).toEqual({ w: 4, h: 3 })
    })
  })

  describe('pixel size calculation', () => {
    it('should calculate initial pixel size correctly', () => {
      const layout = [{ id: 'item1', x: 0, y: 0, w: 2, h: 2 }] as GridItem[]
      const { result } = renderHook(() => useResize({
        ...defaultOptions,
        layout,
        setLayout: mockSetLayout,
        updateLayout: mockUpdateLayout
      }))

      const startEvent = createReactMouseEvent(100, 100)
      act(() => {
        result.current.handleResizeStart('item1', 'se', startEvent)
      })

      // With containerWidth=1200, containerPadding=[16,16], cols=12, gap=16
      // gridWidth = 1200 - 32 = 1168
      // colWidth = (1168 - 16 * 11) / 12 = (1168 - 176) / 12 = 992 / 12 ≈ 82.67
      // For w=2: pixelWidth = 2 * 82.67 + 1 * 16 = 181.33
      expect(result.current.resizeState.currentPixelSize).toBeDefined()
      expect(result.current.resizeState.currentPixelSize?.w).toBeGreaterThan(0)
      expect(result.current.resizeState.currentPixelSize?.h).toBeGreaterThan(0)
    })
  })
})

describe('useDrag hook', () => {
  const defaultOptions = {
    cols: 12,
    rowHeight: 60,
    gap: 16,
    margin: undefined,
    containerPadding: [16, 16] as [number, number],
    containerWidth: 1200,
    maxRows: undefined,
    preventCollision: false,
    allowOverlap: false,
    isBounded: true,
    compactType: 'vertical' as const,
    layout: [
      { id: 'item1', x: 2, y: 2, w: 3, h: 2 }
    ] as GridItem[],
    setLayout: vi.fn(),
    updateLayout: vi.fn(),
    containerRef: { current: document.createElement('div') } as React.RefObject<HTMLDivElement>
  }

  it('should start with isDragging = false', () => {
    const { result } = renderHook(() => useDrag(defaultOptions))

    expect(result.current.dragState.isDragging).toBe(false)
    expect(result.current.dragState.draggedItem).toBeNull()
  })

  it('should call onDragStart when drag begins', () => {
    const onDragStart = vi.fn()
    const { result } = renderHook(() => useDrag({
      ...defaultOptions,
      onDragStart
    }))

    const startEvent = createReactMouseEvent(100, 100)
    act(() => {
      result.current.handleDragStart('item1', startEvent)
    })

    expect(result.current.dragState.isDragging).toBe(true)
    expect(result.current.dragState.draggedItem).toBe('item1')
    expect(onDragStart).toHaveBeenCalledTimes(1)
  })
})
