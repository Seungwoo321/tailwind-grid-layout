import { GridItem, GridPosition } from '../types'

export function calculateGridPosition(
  x: number,
  y: number,
  cols: number,
  rowHeight: number,
  gap: number,
  containerWidth: number,
  margin?: [number, number]
): { col: number; row: number } {
  const verticalMargin = margin ? margin[1] : gap
  
  // React Grid Layout과 동일한 방식으로 계산  
  const unitWidth = containerWidth / cols
  
  // 사용 임계값으로 스무스한 그리드 스냅
  const threshold = 0.3 // 30% 진입 시 스냅
  
  // 그리드 위치 계산 with threshold
  const colFloat = x / unitWidth
  const rowFloat = y / (rowHeight + verticalMargin)
  
  // 임계값을 적용한 스냅
  const col = Math.floor(colFloat + threshold)
  const row = Math.floor(rowFloat + threshold)
  
  return {
    col: Math.max(0, col),
    row: Math.max(0, row)
  }
}

export function getPixelPosition(
  item: GridPosition,
  cols: number,
  rowHeight: number,
  gap: number,
  containerWidth: number,
  margin?: [number, number],
  containerPadding?: [number, number]
): { left: number; top: number; width: number; height: number } {
  const horizontalMargin = margin ? margin[0] : gap
  const verticalMargin = margin ? margin[1] : gap
  const leftPadding = containerPadding ? containerPadding[0] : 0
  const topPadding = containerPadding ? containerPadding[1] : 0
  
  // React Grid Layout과 동일한 계산 방식
  // 컨테이너 패딩을 제외한 실제 그리드 영역
  const gridWidth = containerWidth - (leftPadding * 2)
  const totalMarginWidth = (cols - 1) * horizontalMargin
  const availableWidth = gridWidth - totalMarginWidth
  const unitWidth = availableWidth / cols
  
  // 위치 계산 (컨테이너 패딩 포함)
  const left = leftPadding + item.x * (unitWidth + horizontalMargin)
  const width = item.w * unitWidth + (item.w - 1) * horizontalMargin
  
  return {
    left: Math.round(left),
    top: topPadding + item.y * (rowHeight + verticalMargin),
    width: Math.round(width),
    height: item.h * rowHeight + (item.h - 1) * verticalMargin
  }
}

export function checkCollision(
  item1: GridPosition,
  item2: GridPosition
): boolean {
  return !(
    item1.x + item1.w <= item2.x ||
    item2.x + item2.w <= item1.x ||
    item1.y + item1.h <= item2.y ||
    item2.y + item2.h <= item1.y
  )
}

export function findFreeSpace(
  items: GridItem[],
  itemToPlace: GridPosition,
  cols: number,
  excludeId?: string
): GridPosition {
  const itemsToCheck = excludeId 
    ? items.filter(item => item.id !== excludeId)
    : items
  
  // First, try to place at the requested position
  const hasCollisionAtOriginal = itemsToCheck.some(item => 
    checkCollision(itemToPlace, item)
  )
  
  if (!hasCollisionAtOriginal) {
    return itemToPlace
  }
  
  // If there's collision, find the nearest free space
  let y = itemToPlace.y
  
  while (true) {
    for (let x = 0; x <= cols - itemToPlace.w; x++) {
      const testPosition = { ...itemToPlace, x, y }
      const hasCollision = itemsToCheck.some(item => 
        checkCollision(testPosition, item)
      )
      
      if (!hasCollision) {
        return testPosition
      }
    }
    y++
  }
}

export function compactLayout(
  items: GridItem[],
  cols: number,
  compactType: 'vertical' | 'horizontal' | null = 'vertical'
): GridItem[] {
  if (!compactType) return items
  
  // Separate static and non-static items
  const staticItems = items.filter(item => item.static)
  const nonStaticItems = items.filter(item => !item.static)
  
  // Sort non-static items based on compact type
  const sorted = [...nonStaticItems].sort((a, b) => {
    if (compactType === 'horizontal') {
      // For horizontal compacting, sort by x then y
      if (a.x === b.x) return a.y - b.y
      return a.x - b.x
    } else {
      // For vertical compacting, sort by y then x
      if (a.y === b.y) return a.x - b.x
      return a.y - b.y
    }
  })
  
  const compacted: GridItem[] = [...staticItems]
  
  sorted.forEach(item => {
    if (compactType === 'vertical') {
      // Find the topmost position for this item
      let minY = 0
      let found = false
      
      // Try each row from top to bottom
      for (let y = 0; !found; y++) {
        const testItem = { ...item, y, x: item.x }
        const hasCollision = compacted.some(placed => 
          checkCollision(testItem, placed)
        )
        
        if (!hasCollision) {
          minY = y
          found = true
        }
      }
      
      compacted.push({ ...item, y: minY })
    } else if (compactType === 'horizontal') {
      // Find the leftmost position for this item
      let minX = 0
      let found = false
      
      // Try each column from left to right
      for (let x = 0; x <= cols - item.w && !found; x++) {
        const testItem = { ...item, x, y: item.y }
        const hasCollision = compacted.some(placed => 
          checkCollision(testItem, placed)
        )
        
        if (!hasCollision) {
          minX = x
          found = true
        }
      }
      
      compacted.push({ ...item, x: minX })
    }
  })
  
  return compacted
}

export function shouldSwapItems(
  draggingItem: GridPosition,
  targetItem: GridPosition,
  originalItem: GridPosition
): boolean {
  const draggingCenterX = draggingItem.x + draggingItem.w / 2
  const draggingCenterY = draggingItem.y + draggingItem.h / 2
  const targetCenterX = targetItem.x + targetItem.w / 2
  const targetCenterY = targetItem.y + targetItem.h / 2
  
  const isMovingDown = draggingItem.y > originalItem.y
  const isMovingUp = draggingItem.y < originalItem.y
  const isMovingRight = draggingItem.x > originalItem.x
  const isMovingLeft = draggingItem.x < originalItem.x
  
  if (isMovingDown && draggingCenterY > targetCenterY) return true
  if (isMovingUp && draggingCenterY < targetCenterY) return true
  if (isMovingRight && draggingCenterX > targetCenterX) return true
  if (isMovingLeft && draggingCenterX < targetCenterX) return true
  
  return false
}

export function moveItems(
  layout: GridItem[],
  item: GridItem,
  _cols: number,
  originalItem?: GridItem
): GridItem[] {
  if (!originalItem) return layout
  
  const movedLayout = [...layout]
  const itemIndex = movedLayout.findIndex(l => l.id === item.id)
  if (itemIndex !== -1) {
    movedLayout[itemIndex] = { ...item }
  }
  
  // 충돌하는 아이템들 찾기
  const collisions = movedLayout.filter(l => {
    if (l.id === item.id || l.static) return false
    return checkCollision(item, l)
  })
  
  // 충돌하는 아이템들을 밀어내기
  const isMovingUp = item.y < originalItem.y
  const isMovingDown = item.y > originalItem.y
  
  for (const collision of collisions) {
    const collisionIndex = movedLayout.findIndex(l => l.id === collision.id)
    if (collisionIndex !== -1) {
      if (isMovingUp) {
        // 위로 이동할 때는 충돌 아이템을 아래로 밀기
        movedLayout[collisionIndex] = { 
          ...collision, 
          y: item.y + item.h 
        }
      } else if (isMovingDown) {
        // 아래로 이동할 때는 충돌 아이템을 위로 밀기
        movedLayout[collisionIndex] = { 
          ...collision, 
          y: Math.max(0, item.y - collision.h) 
        }
      } else {
        // 좌우 이동시 원래 로직 사용
        if (shouldSwapItems(item, collision, originalItem)) {
          movedLayout[collisionIndex] = { 
            ...collision, 
            x: originalItem.x, 
            y: originalItem.y 
          }
        }
      }
    }
  }
  
  return movedLayout
}

export function getAllCollisions(
  layout: GridItem[],
  item: GridItem
): GridItem[] {
  return layout.filter(l => l.id !== item.id && checkCollision(l, item))
}