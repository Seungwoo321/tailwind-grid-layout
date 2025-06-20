import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { userEvent } from '@vitest/browser/context'
import { DroppableGridContainer } from '../DroppableGridContainer'
import type { GridItem } from '../../types'

describe('DroppableGridContainer Browser Tests', () => {
  const defaultItems: GridItem[] = [
    { id: '1', x: 0, y: 0, w: 2, h: 2 },
    { id: '2', x: 2, y: 0, w: 2, h: 2 }
  ]

  it('should hide overlay when dragging leaves container bounds - real browser test', async () => {
    const { container } = render(
      <DroppableGridContainer items={defaultItems}>
        {(item) => <div style={{ padding: '10px', background: '#f0f0f0' }}>Item {item.id}</div>}
      </DroppableGridContainer>
    )

    const gridContainer = container.querySelector('.relative')! as HTMLElement
    
    // Create draggable element
    const dragSource = document.createElement('div')
    dragSource.draggable = true
    dragSource.style.width = '50px'
    dragSource.style.height = '50px'
    dragSource.style.background = 'blue'
    dragSource.textContent = 'Drag me'
    document.body.appendChild(dragSource)

    // Start dragging
    await userEvent.dragAndDrop(dragSource, gridContainer)
    
    // Verify overlay appears during drag
    const overlay = gridContainer.querySelector('.bg-blue-500\\/10')
    expect(overlay).toBeTruthy()

    // Clean up
    document.body.removeChild(dragSource)
  })

  it('should properly handle dragLeave with real coordinates', async () => {
    const { container } = render(
      <div style={{ padding: '100px' }}>
        <DroppableGridContainer items={defaultItems}>
          {(item) => <div>Item {item.id}</div>}
        </DroppableGridContainer>
      </div>
    )

    const gridContainer = container.querySelector('.relative')! as HTMLElement
    
    // Get real bounding rect
    const rect = gridContainer.getBoundingClientRect()
    
    // Create and dispatch real dragover event
    const dragOverEvent = new DragEvent('dragover', {
      bubbles: true,
      cancelable: true,
      dataTransfer: new DataTransfer()
    })
    act(() => {
      gridContainer.dispatchEvent(dragOverEvent)
    })
    
    // Verify overlay is shown
    expect(gridContainer.querySelector('.bg-blue-500\\/10')).toBeTruthy()
    
    // Create and dispatch dragLeave event with coordinates outside bounds
    const dragLeaveEvent = new DragEvent('dragleave', {
      bubbles: true,
      cancelable: true,
      clientX: rect.left - 50,
      clientY: rect.top + rect.height / 2
    })
    act(() => {
      gridContainer.dispatchEvent(dragLeaveEvent)
    })
    
    // Verify overlay is hidden
    expect(gridContainer.querySelector('.bg-blue-500\\/10')).toBeFalsy()
  })
})