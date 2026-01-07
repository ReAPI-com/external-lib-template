import { beforeEach, describe, expect, it } from 'vitest'
import { modifyResponseData } from './modifyResponseData'

describe('modifyResponseData (afterResponse hook)', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // afterResponse hooks have access to $request, $response, and $context.
  // They can modify $response and $context after receiving the API response.
  // Mock these globals before each test.
  // ============================================================================

  beforeEach(() => {
    // @ts-ignore - globalThis typing
    globalThis.$request = {
      method: 'GET',
      url: 'https://api.example.com/users',
      headers: {},
      query: {},
      body: null,
    }

    // @ts-ignore - globalThis typing
    globalThis.$response = {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      data: { users: [{ id: 1, name: 'John' }] },
    }

    // @ts-ignore - globalThis typing
    globalThis.$context = {
      foo: 'bar', // Set by beforeRequest hook
    }
  })

  // ============================================================================
  // Test Cases
  // ============================================================================

  it('should add context value to response data', async () => {
    await modifyResponseData()

    expect($response.data.foo).toBe('bar')
  })

  it('should update context with new value', async () => {
    await modifyResponseData()

    expect($context.bar).toBe('foo')
  })

  it('should preserve existing response data', async () => {
    await modifyResponseData()

    expect($response.data.users).toEqual([{ id: 1, name: 'John' }])
  })

  it('should preserve existing context values', async () => {
    await modifyResponseData()

    expect($context.foo).toBe('bar')
  })

  it('should handle null response data gracefully', async () => {
    $response.data = null

    // Should not throw
    await modifyResponseData()

    expect($context.bar).toBe('foo')
  })

  it('should handle undefined response data gracefully', async () => {
    $response.data = undefined

    // Should not throw
    await modifyResponseData()

    expect($context.bar).toBe('foo')
  })
})

