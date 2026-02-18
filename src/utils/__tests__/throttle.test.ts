import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { throttle } from '../throttle'

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should call function immediately on first call', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should not call function again within wait time', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    throttled()
    throttled()

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('should call function after wait time via setTimeout', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Call again within wait time - should set timeout
    vi.advanceTimersByTime(50)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Wait for timeout to fire
    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('should clear existing timeout when called after wait expires (lines 14-17)', () => {
    // This test covers lines 14-17: clearing an existing timeout when remaining <= 0
    // We need to have a pending timeout AND remaining <= 0 at the same time
    // Use setSystemTime to change Date.now() without firing timers
    // Start at a high enough time that remaining <= 0 on first call
    vi.setSystemTime(new Date(1000))

    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    // First call at t=1000 - immediate execution (remaining = 100 - (1000 - 0) < 0)
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Set time to t=1050 and call - sets a pending timeout for 50ms later
    vi.setSystemTime(new Date(1050))
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)
    // Now there's a pending timeout (remaining = 50 > 0)

    // Set time to t=1200 (past wait period) WITHOUT firing timers
    // remaining = 100 - (1200 - 1000) = -100 <= 0
    // AND timeout is still pending, so lines 14-17 execute
    vi.setSystemTime(new Date(1200))
    throttled()
    expect(fn).toHaveBeenCalledTimes(2) // Immediate execution due to remaining <= 0
  })

  it('should handle remaining > wait edge case', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    // First call
    throttled()
    expect(fn).toHaveBeenCalledTimes(1)

    // Mock Date.now to simulate time going backwards (remaining > wait)
    const originalDateNow = Date.now
    let mockTime = originalDateNow()
    vi.spyOn(Date, 'now').mockImplementation(() => mockTime)

    // Set lastTime by calling throttled
    mockTime = 1000
    throttled()

    // Simulate time going backwards (mockTime < lastTime)
    mockTime = 500
    throttled()

    // Should still execute because remaining > wait
    expect(fn).toHaveBeenCalledTimes(3)

    vi.spyOn(Date, 'now').mockRestore()
  })

  it('should pass arguments to the throttled function', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled('arg1', 'arg2')

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('should pass arguments via setTimeout callback', () => {
    const fn = vi.fn()
    const throttled = throttle(fn, 100)

    throttled('first')
    vi.advanceTimersByTime(50)
    throttled('second')

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenLastCalledWith('first')

    vi.advanceTimersByTime(50)
    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenLastCalledWith('second')
  })
})
