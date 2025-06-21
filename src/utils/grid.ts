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
  const horizontalMargin = margin ? margin[0] : gap
  const verticalMargin = margin ? margin[1] : gap
  const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols
  
  // Use threshold for smoother grid snapping
  const threshold = 0.3 // Snap when 30% into the next grid unit
  
  // Calculate grid positions with threshold
  const colFloat = x / (colWidth + horizontalMargin)
  const rowFloat = y / (rowHeight + verticalMargin)
  
  // Apply threshold for smoother snapping
  const col = Math.floor(colFloat + threshold)
  const row = Math.floor(rowFloat + threshold)
  
  console.log('[Grid] Position calculation:', {
    x, y, colFloat, rowFloat, col, row, 
    colWidth, rowHeight, threshold
  })
  
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
  margin?: [number, number]
): { left: number; top: number; width: number; height: number } {
  const horizontalMargin = margin ? margin[0] : gap
  const verticalMargin = margin ? margin[1] : gap
  const colWidth = (containerWidth - horizontalMargin * (cols - 1)) / cols
  
  return {
    left: item.x * (colWidth + horizontalMargin),
    top: item.y * (rowHeight + verticalMargin),
    width: item.w * colWidth + (item.w - 1) * horizontalMargin,
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

export function moveItems(
  layout: GridItem[],
  item: GridItem,
  _cols: number,
  _originalItem?: GridItem
): GridItem[] {
  const compareWith = { ...item }
  const movedLayout = [...layout]
  
  // Update the position of the moving item in the layout
  const itemIndex = movedLayout.findIndex(l => l.id === item.id)
  if (itemIndex !== -1) {
    movedLayout[itemIndex] = compareWith
  }
  
  // React Grid Layout style: check for collisions
  const getCollisions = (checkItem: GridItem): GridItem[] => {
    return movedLayout.filter(l => {
      if (l.id === checkItem.id || l.static) return false
      return checkCollision(checkItem, l)
    })
  }
  
  // Process collisions iteratively until no more collisions
  const processedIds = new Set<string>()
  const itemsToMove: GridItem[] = [compareWith]
  
  while (itemsToMove.length > 0) {
    const currentItem = itemsToMove.shift()!
    if (processedIds.has(currentItem.id)) continue
    processedIds.add(currentItem.id)
    
    const collisions = getCollisions(currentItem)
    
    for (const collision of collisions) {
      if (processedIds.has(collision.id)) continue
      
      // Calculate new position for the colliding item
      const newY = currentItem.y + currentItem.h
      const movedCollision = { ...collision, y: newY }
      
      // Update in layout
      const collisionIndex = movedLayout.findIndex(l => l.id === collision.id)
      if (collisionIndex !== -1) {
        movedLayout[collisionIndex] = movedCollision
        // Add to queue to check for further collisions
        itemsToMove.push(movedCollision)
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