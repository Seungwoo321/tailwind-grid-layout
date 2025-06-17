import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ResizeHandle } from '../ResizeHandle'

describe('ResizeHandle', () => {
  const mockOnMouseDown = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('corner handles', () => {
    it.each(['se', 'sw', 'ne', 'nw'] as const)('should render %s handle when visible', (position) => {
      const { container } = render(
        <ResizeHandle 
          position={position} 
          onMouseDown={mockOnMouseDown}
          isVisible={true}
        />
      )

      const handle = container.querySelector('.react-grid-layout__resize-handle')
      expect(handle).toBeTruthy()
      expect(handle).toHaveStyle({ backgroundImage: expect.stringContaining('data:image/svg+xml') })
    })

    it('should handle mouse down event', () => {
      const { container } = render(
        <ResizeHandle 
          position="se" 
          onMouseDown={mockOnMouseDown}
          isActive={true}
          isVisible={true}
        />
      )

      const handle = container.querySelector('.react-grid-layout__resize-handle') as HTMLElement
      fireEvent.mouseDown(handle)
      
      expect(mockOnMouseDown).toHaveBeenCalled()
    })

    it('should not handle mouse down when inactive', () => {
      const { container } = render(
        <ResizeHandle 
          position="se" 
          onMouseDown={mockOnMouseDown}
          isActive={false}
          isVisible={true}
        />
      )

      const handle = container.querySelector('.react-grid-layout__resize-handle') as HTMLElement
      fireEvent.mouseDown(handle)
      
      expect(mockOnMouseDown).not.toHaveBeenCalled()
    })

    it('should apply correct styles for each corner', () => {
      const positions = {
        se: { bottom: '0px', right: '0px' },
        sw: { bottom: '0px', left: '0px' },
        ne: { top: '0px', right: '0px' },
        nw: { top: '0px', left: '0px' }
      }

      Object.entries(positions).forEach(([position, expectedStyle]) => {
        const { container } = render(
          <ResizeHandle 
            position={position as any} 
            onMouseDown={mockOnMouseDown}
            isVisible={true}
          />
        )

        const handle = container.querySelector('.react-grid-layout__resize-handle') as HTMLElement
        Object.entries(expectedStyle).forEach(([prop, value]) => {
          expect(handle.style[prop as any]).toBe(value)
        })
      })
    })
  })

  describe('edge handles', () => {
    it.each(['n', 's', 'e', 'w'] as const)('should render %s handle when not visible', (position) => {
      const { container } = render(
        <ResizeHandle 
          position={position} 
          onMouseDown={mockOnMouseDown}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div')
      expect(handle).toBeTruthy()
      expect(handle).toHaveClass('absolute')
    })

    it('should apply pointer-events-none when isActive is false', () => {
      const { container } = render(
        <ResizeHandle 
          position="n" 
          onMouseDown={mockOnMouseDown}
          isActive={false}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div')
      expect(handle).toHaveClass('pointer-events-none')
    })

    it('should not apply pointer-events-none when isActive is true', () => {
      const { container } = render(
        <ResizeHandle 
          position="n" 
          onMouseDown={mockOnMouseDown}
          isActive={true}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div')
      expect(handle).not.toHaveClass('pointer-events-none')
    })

    it.each(['n', 's', 'e', 'w'] as const)('should not apply w-5 h-5 classes to edge handle %s', (position) => {
      const { container } = render(
        <ResizeHandle 
          position={position} 
          onMouseDown={mockOnMouseDown}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div')
      expect(handle).not.toHaveClass('w-5')
      expect(handle).not.toHaveClass('h-5')
    })

    it.each(['sw', 'ne', 'nw'] as const)('should apply w-5 h-5 classes to corner handle %s when not visible', (position) => {
      const { container } = render(
        <ResizeHandle 
          position={position} 
          onMouseDown={mockOnMouseDown}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div')
      expect(handle).toHaveClass('w-5')
      expect(handle).toHaveClass('h-5')
    })

    it('should set onMouseDown to undefined when isActive is false', () => {
      const { container } = render(
        <ResizeHandle 
          position="n" 
          onMouseDown={mockOnMouseDown}
          isActive={false}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div') as HTMLElement
      fireEvent.mouseDown(handle)
      
      // onMouseDown should not be called because it's set to undefined
      expect(mockOnMouseDown).not.toHaveBeenCalled()
    })

    it('should call onMouseDown when isActive is true', () => {
      const { container } = render(
        <ResizeHandle 
          position="n" 
          onMouseDown={mockOnMouseDown}
          isActive={true}
          isVisible={false}
        />
      )

      const handle = container.querySelector('div') as HTMLElement
      fireEvent.mouseDown(handle)
      
      expect(mockOnMouseDown).toHaveBeenCalled()
    })

    it('should apply correct cursor classes', () => {
      const cursors = {
        n: 'cursor-n-resize',
        s: 'cursor-s-resize',
        e: 'cursor-e-resize',
        w: 'cursor-w-resize'
      }

      Object.entries(cursors).forEach(([position, cursorClass]) => {
        const { container } = render(
          <ResizeHandle 
            position={position as any} 
            onMouseDown={mockOnMouseDown}
            isVisible={false}
          />
        )

        const handle = container.querySelector('div')
        expect(handle).toHaveClass(cursorClass)
      })
    })

    it('should render edge handles with correct positioning when visible', () => {
      const edgePositions = ['n', 's', 'e', 'w'] as const
      
      edgePositions.forEach((position) => {
        const { container } = render(
          <ResizeHandle 
            position={position} 
            onMouseDown={mockOnMouseDown}
            isVisible={true}
          />
        )

        // Edge handles return null when visible
        expect(container.firstChild).toBeNull()
      })
    })
  })

  it('should return null for unsupported positions when visible', () => {
    const { container } = render(
      <ResizeHandle 
        position="n" 
        onMouseDown={mockOnMouseDown}
        isVisible={true}
      />
    )

    expect(container.firstChild).toBeNull()
  })

  it('should handle transform styles for corners', () => {
    const transforms = {
      sw: 'scaleX(-1)',
      ne: 'scaleY(-1)',
      nw: 'scale(-1, -1)'
    }

    Object.entries(transforms).forEach(([position, transform]) => {
      const { container } = render(
        <ResizeHandle 
          position={position as any} 
          onMouseDown={mockOnMouseDown}
          isVisible={true}
        />
      )

      const handle = container.querySelector('.react-grid-layout__resize-handle') as HTMLElement
      expect(handle.style.transform).toBe(transform)
    })
  })
})