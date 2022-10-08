import { debounce, throttle } from '../src/index'

const FIXED_SYSTEM_TIME = '2020-01-12T00:00:00Z'

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME))
  })
  test('it properly debounces function', () => {
    const func = jest.fn()
    const debouncedFunction = debounce(func, 100)

    debouncedFunction()
    expect(func).not.toBeCalled()

    jest.advanceTimersByTime(50)
    expect(func).not.toBeCalled()

    jest.advanceTimersByTime(100)
    expect(func).toBeCalled()
    expect(func.mock.calls.length).toBe(1)
  })

  test('it properly debounces function with isImmediate set to true ', () => {
    const func = jest.fn()
    const debouncedFunction = debounce(func, 100, { isImmediate: true })

    debouncedFunction()
    expect(func).toBeCalled()
    expect(func.mock.calls.length).toBe(1)

    jest.advanceTimersByTime(50)
    expect(func.mock.calls.length).toBe(1)

    jest.advanceTimersByTime(100)
    expect(func.mock.calls.length).toBe(1)

    // it should be possible to call it second time after timeout passes
    debouncedFunction()
    expect(func.mock.calls.length).toBe(2)
  })

  test('it cancels debounced function ', () => {
    const func = jest.fn()
    const debouncedFunction = debounce(func, 100)

    const result = debouncedFunction()
    expect(func).not.toBeCalled()

    jest.advanceTimersByTime(50)
    expect(func).not.toBeCalled()

    debouncedFunction.cancel()

    jest.advanceTimersByTime(100)
    expect(func).not.toBeCalled()

    expect(result).rejects.toBeUndefined()
  })

  describe('maxWait', () => {
    test('it calls func with maxWait >= wait correctly', () => {
      const func = jest.fn()
      const debouncedFunction = debounce(func, 100, { maxWait: 150 })
      debouncedFunction()

      jest.advanceTimersByTime(50)
      expect(func).not.toBeCalled()
      debouncedFunction()

      // function should be called because of maxWait
      jest.advanceTimersByTime(100)
      expect(func).toBeCalled()
    })

    test('it calls func with maxWait < wait correctly', () => {
      const func = jest.fn()
      const debouncedFunction = debounce(func, 100, { maxWait: 50 })
      debouncedFunction()

      // function should be called because of maxWait
      jest.advanceTimersByTime(50)
      expect(func).toBeCalled()

      jest.advanceTimersByTime(50)
      expect(func.mock.calls.length).toBe(1)

      debouncedFunction()
      jest.advanceTimersByTime(100)
      expect(func.mock.calls.length).toBe(2)
    })

    test('it calls in the next tick with maxWait === 0', () => {
      const func = jest.fn()
      const debouncedFunction = debounce(func, 100, { maxWait: 0 })
      debouncedFunction()

      jest.advanceTimersByTime(1)
      expect(func).toBeCalled()
    })
  })

  describe('callback', () => {
    test('it properly debounces function with callback provided', async () => {
      const mockValue = {
        message: 'Hello World',
      }
      const callback = jest.fn()
      const func = jest.fn().mockReturnValue(mockValue)

      const debouncedFunction = debounce(func, 100, {
        callback,
      })
      const promise = debouncedFunction()
      jest.advanceTimersByTime(100)
      await promise
      expect(callback).toBeCalledWith(mockValue)
    })
  })

  describe('promises', () => {
    test('it properly debounces function and returns a Promise', async () => {
      const func = jest.fn().mockReturnValue(12345)
      const debouncedFunction = debounce(func, 100)

      const result = debouncedFunction()
      const result1 = debouncedFunction()

      jest.advanceTimersByTime(100)

      await expect(result).resolves.toEqual(12345)
      await expect(result1).resolves.toEqual(12345)
    })

    test('it properly debounces async functions', async () => {
      const asyncFunc = jest.fn().mockResolvedValue(12345)
      const debouncedFunction = debounce(asyncFunc, 100)

      const promise = debouncedFunction()

      jest.advanceTimersByTime(100)

      await expect(promise).resolves.toEqual(12345)
    })

    test('it properly rejects after debounced function is cancelled', async () => {
      const func = jest.fn()
      const debouncedFunction = debounce(func, 100)

      const result = debouncedFunction()
      const result1 = debouncedFunction()

      const reason = 'changed my mind'
      debouncedFunction.cancel(reason)

      await expect(result).rejects.toEqual(reason)
      await expect(result1).rejects.toEqual(reason)
    })
  })
})

describe('throttle', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME))
  })

  test('throttle function', () => {
    const func = jest.fn()

    const throttledFunction = throttle(func, 100)

    throttledFunction()
    expect(func).not.toBeCalled()

    jest.advanceTimersByTime(50)

    expect(func).not.toBeCalled()

    jest.advanceTimersByTime(100)
    expect(func).toBeCalled()
    expect(func.mock.calls.length).toBe(1)
  })

  describe('', () => {})

  describe('promises', () => {
    // test('',async () => {})

    // test('',async () => {})

    test('it properly rejects after throttle function is cancelled', async () => {
      const func = jest.fn()

      const throttledFunction = throttle(func, 100)

      const result = throttledFunction()
      const result1 = throttledFunction()

      const reason = 'jest test'
      throttledFunction.cancel(reason)

      await expect(result).rejects.toEqual(reason)
      await expect(result1).rejects.toEqual(reason)
    })
  })
})
