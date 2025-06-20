import { useEffect, useState, useRef, ComponentType } from 'react'

export interface WidthProviderProps {
  measureBeforeMount?: boolean
}

export function WidthProvider<P extends { width?: number }>(
  Component: ComponentType<P>
): ComponentType<Omit<P, 'width'> & WidthProviderProps> {
  return function WidthProviderComponent(
    props: Omit<P, 'width'> & WidthProviderProps
  ) {
    const { measureBeforeMount = false, ...rest } = props
    const [width, setWidth] = useState<number | undefined>(
      measureBeforeMount ? undefined : 1280
    )
    const elementRef = useRef<HTMLDivElement>(null)
    const mounted = useRef(false)

    useEffect(() => {
      mounted.current = true
      
      const handleResize = () => {
        const element = elementRef.current
        if (!element) return
        const newWidth = element.offsetWidth
        setWidth(newWidth)
      }

      // Initial measurement - only if not measureBeforeMount
      if (!measureBeforeMount) {
        handleResize()
      }

      // ResizeObserver for better performance
      let resizeObserver: ResizeObserver | null = null
      if (elementRef.current && 'ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(handleResize)
        resizeObserver.observe(elementRef.current)
      } else {
        // Fallback to window resize
        window.addEventListener('resize', handleResize)
      }

      return () => {
        mounted.current = false
        if (resizeObserver) {
          resizeObserver.disconnect()
        } else {
          window.removeEventListener('resize', handleResize)
        }
      }
    }, [measureBeforeMount])

    // Don't render until we have a width (if measureBeforeMount is true)
    if (measureBeforeMount && width === undefined) {
      return <div ref={elementRef} style={{ width: '100%' }} />
    }

    return (
      <div ref={elementRef} style={{ width: '100%' }}>
        <Component {...(rest as P)} width={width} />
      </div>
    )
  }
}