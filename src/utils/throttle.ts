export function throttle<T extends (...args: never[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeout: NodeJS.Timeout | null = null

  return function throttled(...args: Parameters<T>) {
    const now = Date.now()
    const timeSinceLastCall = now - lastCall

    if (timeSinceLastCall >= delay) {
      lastCall = now
      func(...args)
    } else {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => {
        lastCall = Date.now()
        func(...args)
        timeout = null
      }, delay - timeSinceLastCall)
    }
  }
}