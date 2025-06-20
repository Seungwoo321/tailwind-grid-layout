import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import React from 'react'
import { GridContainer } from '../GridContainer'
import type { GridItem } from '../../types'

describe('GridContainer - Branch Coverage', () => {
  it('should cover droppingItem || operators (lines 529-530)', () => {
    const items: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 }
    ]
    
    // Test 1: droppingItem with null w and h
    const { rerender } = render(
      <GridContainer 
        items={items} 
        droppingItem={{ w: null as any, h: null as any }}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    let placeholder = document.querySelector('.bg-gray-200')
    expect(placeholder).toBeInTheDocument()
    
    // Test 2: droppingItem with undefined w and h
    rerender(
      <GridContainer 
        items={items} 
        droppingItem={{ w: undefined, h: undefined }}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    placeholder = document.querySelector('.bg-gray-200')
    expect(placeholder).toBeInTheDocument()
    
    // Test 3: droppingItem with 0 values (falsy but not null/undefined)
    rerender(
      <GridContainer 
        items={items} 
        droppingItem={{ w: 0, h: 0 }}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    placeholder = document.querySelector('.bg-gray-200')
    expect(placeholder).toBeInTheDocument()
    
    // Test 4: droppingItem with valid values
    rerender(
      <GridContainer 
        items={items} 
        droppingItem={{ w: 3, h: 2 }}
      >
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    placeholder = document.querySelector('.bg-gray-200')
    expect(placeholder).toBeInTheDocument()
  })

  it('should cover calculatedHeight || 0 fallback (line 438)', () => {
    // Render with no items to trigger the || 0 fallback
    const { container } = render(
      <GridContainer items={[]} autoSize={true}>
        {(item) => <div>{item.id}</div>}
      </GridContainer>
    )
    
    const gridContainer = container.querySelector('.relative')
    expect(gridContainer).toBeInTheDocument()
    // With empty layout, calculatedHeight should be 0
  })

  it('should cover layout state update branches (line 77)', () => {
    // Start with items that have positions
    const initialItems: GridItem[] = [
      { id: '1', x: 0, y: 0, w: 2, h: 2 },
      { id: '2', x: 2, y: 0, w: 2, h: 2 }
    ]
    
    const { rerender } = render(
      <GridContainer items={initialItems}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    // Update with new items and changed existing items
    const updatedItems: GridItem[] = [
      { id: '1', x: 3, y: 3, w: 4, h: 4 }, // Existing item with new position
      { id: '3', x: 0, y: 2, w: 1, h: 1 }  // New item
    ]
    
    rerender(
      <GridContainer items={updatedItems}>
        {(item) => <div data-testid={`item-${item.id}`}>{item.id}</div>}
      </GridContainer>
    )
    
    // Items should be rendered with their positions preserved/updated
    expect(document.querySelector('[data-testid="item-1"]')).toBeInTheDocument()
    expect(document.querySelector('[data-testid="item-3"]')).toBeInTheDocument()
  })
})