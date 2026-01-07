import { beforeEach, describe, expect, it } from 'vitest'
import { modifyRequestParams } from './modifyRequestParams'

describe('modifyRequestParams (beforeRequest hook)', () => {
  // ============================================================================
  // Test Setup
  // ============================================================================
  // beforeRequest hooks have access to $request and $context.
  // They can modify these objects to change the outgoing request.
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
    globalThis.$context = {}
  })

  // ============================================================================
  // Test Cases
  // ============================================================================

  it('should add Authorization header', async () => {
    await modifyRequestParams()

    expect($request.headers['Authorization']).toBe('Bearer 1234567890')
  })

  it('should add query parameter', async () => {
    await modifyRequestParams()

    expect($request.query.foo).toBeDefined()
    expect(typeof $request.query.foo).toBe('number')
  })

  it('should add X-Timestamp header', async () => {
    await modifyRequestParams()

    expect($request.headers['X-Timestamp']).toBeDefined()
    expect(typeof $request.headers['X-Timestamp']).toBe('number')
  })

  it('should update context', async () => {
    await modifyRequestParams()

    expect($context.foo).toBe('bar')
  })

  it('should not modify existing headers', async () => {
    $request.headers['Existing-Header'] = 'existing-value'

    await modifyRequestParams()

    expect($request.headers['Existing-Header']).toBe('existing-value')
  })
})

