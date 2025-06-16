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
  const col = Math.round(x / (colWidth + horizontalMargin))
  const row = Math.round(y / (rowHeight + verticalMargin))
  
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
  cols: number,
  originalItem?: GridItem
): GridItem[] {
  const compareWith = { ...item }
  const movedLayout = [...layout]
  
  // React Grid Layout style: check for collisions with partial overlap
  const collisions = movedLayout.filter(l => {
    if (l.id === item.id || l.static) return false
    
    // Check if there's any overlap
    const hasOverlap = checkCollision(compareWith, l)
    if (!hasOverlap) return false
    
    // Calculate overlap amount for better movement detection
    const overlapY = Math.min(compareWith.y + compareWith.h, l.y + l.h) - Math.max(compareWith.y, l.y)
    const overlapX = Math.min(compareWith.x + compareWith.w, l.x + l.w) - Math.max(compareWith.x, l.x)
    
    // React Grid Layout behavior: move when overlap is more than 50% in either dimension
    const significantOverlapY = overlapY > compareWith.h * 0.5 || overlapY > l.h * 0.5
    const significantOverlapX = overlapX > compareWith.w * 0.5 || overlapX > l.w * 0.5
    
    return significantOverlapY && significantOverlapX
  })
  
  if (collisions.length === 0) {
    return layout
  }
  
  // Determine direction of movement
  const isMovingDown = originalItem && originalItem.y < compareWith.y
  const isMovingUp = originalItem && originalItem.y > compareWith.y
  
  // Sort collisions for processing
  collisions.sort((a, b) => {
    if (isMovingDown) {
      // Process from top to bottom
      return a.y - b.y
    } else {
      // Process from bottom to top
      return b.y - a.y
    }
  })
  
  // Move colliding items
  collisions.forEach(collision => {
    const collisionIndex = movedLayout.findIndex(l => l.id === collision.id)
    if (collisionIndex === -1) return
    
    // React Grid Layout style movement
    if (isMovingDown) {
      // When moving down, colliding items should move down
      const newY = compareWith.y + compareWith.h
      movedLayout[collisionIndex] = {
        ...collision,
        y: newY
      }
      
      // Recursively move items that this collision pushes down
      const pushedItem = { ...collision, y: newY }
      const secondaryCollisions = movedLayout.filter(l => 
        l.id !== collision.id && 
        l.id !== compareWith.id && 
        !l.static &&
        checkCollision(pushedItem, l)
      )
      
      secondaryCollisions.forEach(secondary => {
        const secIndex = movedLayout.findIndex(l => l.id === secondary.id)
        if (secIndex !== -1) {
          movedLayout[secIndex] = {
            ...secondary,
            y: pushedItem.y + pushedItem.h
          }
        }
      })
    } else if (isMovingUp) {
      // When moving up, only move items that are below the dragged item
      if (collision.y >= compareWith.y) {
        const newY = compareWith.y + compareWith.h
        movedLayout[collisionIndex] = {
          ...collision,
          y: newY
        }
      }
    } else {
      // First placement or horizontal movement
      const newY = compareWith.y + compareWith.h
      movedLayout[collisionIndex] = {
        ...collision,
        y: newY
      }
    }
  })
  
  return movedLayout
}

export function getAllCollisions(
  layout: GridItem[],
  item: GridItem
): GridItem[] {
  return layout.filter(l => l.id !== item.id && checkCollision(l, item))
}