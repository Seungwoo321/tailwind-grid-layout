export interface GridPosition {
  x: number
  y: number
  w: number
  h: number
}

export interface GridItem extends GridPosition {
  id: string
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  isDraggable?: boolean
  isResizable?: boolean
  static?: boolean
  className?: string
}

export interface GridConfig {
  cols: number
  rowHeight: number
  gap: number
  margin?: [number, number]
  containerPadding?: [number, number]
  maxRows?: number
  isDraggable?: boolean
  isResizable?: boolean
  preventCollision?: boolean
  allowOverlap?: boolean
  isBounded?: boolean
  verticalCompact?: boolean
  compactType?: 'vertical' | 'horizontal' | null
  resizeHandles?: Array<'s' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'>
  draggableCancel?: string
  onLayoutChange?: (layout: GridItem[]) => void
  onDragStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDrag?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDragStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResizeStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResize?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResizeStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDrop?: (layout: GridItem[], item: GridItem, e: Event) => void
}

export interface DragState {
  isDragging: boolean
  draggedItem: string | null
  dragOffset: { x: number; y: number }
  placeholder: GridPosition | null
  originalPosition?: GridPosition | null
  currentMousePos?: { x: number; y: number }
}

export interface ResizeState {
  isResizing: boolean
  resizedItem: string | null
  resizeHandle: 'se' | 'sw' | 'ne' | 'nw' | 'n' | 's' | 'e' | 'w' | null
  startSize: { w: number; h: number }
  startPos: { x: number; y: number }
  originalPos?: { x: number; y: number }
}

export type ResizeHandle = 's' | 'w' | 'e' | 'n' | 'sw' | 'nw' | 'se' | 'ne'
export type CompactType = 'vertical' | 'horizontal' | null

export interface GridContainerProps {
  items: GridItem[]
  children: (item: GridItem) => React.ReactNode
  cols?: number
  rowHeight?: number
  gap?: number
  margin?: [number, number]
  containerPadding?: [number, number]
  maxRows?: number
  isDraggable?: boolean
  isResizable?: boolean
  preventCollision?: boolean
  allowOverlap?: boolean
  isBounded?: boolean
  compactType?: CompactType
  resizeHandles?: ResizeHandle[]
  draggableCancel?: string
  draggableHandle?: string
  className?: string
  style?: React.CSSProperties
  autoSize?: boolean // 자동으로 컨테이너 높이 조정
  verticalCompact?: boolean // 레거시 - compactType을 사용하는 것을 권장
  transformScale?: number // 스케일 변환 지원
  droppingItem?: Partial<GridItem> // 드롭 중인 아이템 미리보기
  onLayoutChange?: (layout: GridItem[]) => void
  onDragStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDrag?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDragStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResizeStart?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResize?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onResizeStop?: (layout: GridItem[], oldItem: GridItem, newItem: GridItem, placeholder: GridItem, e: MouseEvent | TouchEvent | PointerEvent, element: HTMLElement) => void
  onDrop?: (e: DragEvent) => void
}