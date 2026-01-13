import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { healthCheck, authenticatedRequest, loginWithCredentials } from './api'

// Mock fetch globally
global.fetch = vi.fn()

describe('API Test Cases', () => {
  let assertionResults: any[] = []

  beforeEach(() => {
    assertionResults = []
    
    // Mock $addAssertionResult
    ;(global as any).$addAssertionResult = (result: any) => {
      assertionResults.push(result)
    }

    // Reset fetch mock
    vi.mocked(global.fetch).mockReset()
  })

  afterEach(() => {
    // Clean up globals
    delete (global as any).$addAssertionResult
    delete (global as any).$vars
    delete (global as any).$secrets
    delete (global as any).$server
    delete (global as any).$auth
  })

  describe('healthCheck', () => {
    beforeEach(() => {
      ;(global as any).$server = {
        baseUrl: 'https://api.example.com',
        name: 'Test Server',
        id: 'server-123',
      }
    })

    it('should pass when health endpoint returns 200', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ status: 'healthy' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await healthCheck()

      expect(assertionResults).toHaveLength(3)
      
      // $server is defined
      expect(assertionResults[0].passed).toBe(true)
      
      // Status is 200
      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 200,
        rightValue: 200,
        message: 'Health endpoint should return 200',
      })

      // JSON data exists
      expect(assertionResults[2]).toMatchObject({
        passed: true,
        leftValue: true,
        rightValue: true,
        message: 'Health endpoint should return JSON data',
      })

      // Verify fetch was called correctly
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/health',
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      )
    })

    it('should fail when health endpoint returns non-200', async () => {
      const mockResponse = {
        status: 503,
        json: vi.fn().mockResolvedValue({ status: 'unhealthy' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await healthCheck()

      expect(assertionResults).toHaveLength(3)
      
      // Status check fails
      expect(assertionResults[1]).toMatchObject({
        passed: false,
        leftValue: 503,
        rightValue: 200,
        message: 'Health endpoint should return 200',
      })
    })

    it('should handle fetch errors gracefully', async () => {
      vi.mocked(global.fetch).mockRejectedValue(new Error('Network error'))

      await healthCheck()

      expect(assertionResults).toHaveLength(2)
      
      // Error assertion
      expect(assertionResults[1]).toMatchObject({
        passed: false,
        leftValue: 'Network error',
        rightValue: 'successful request',
        message: 'Health check request should not throw error',
      })
    })

    it('should fail when $server is not defined', async () => {
      delete (global as any).$server

      await healthCheck()

      expect(assertionResults[0]).toMatchObject({
        passed: false,
        message: '$server should be defined with baseUrl',
      })
    })
  })

  describe('authenticatedRequest', () => {
    beforeEach(() => {
      ;(global as any).$server = {
        baseUrl: 'https://api.example.com',
        name: 'Test Server',
        id: 'server-123',
      }
      ;(global as any).$auth = {
        type: 'bearer',
        headers: {
          Authorization: 'Bearer test-token-123',
        },
        token: 'test-token-123',
      }
    })

    it('should pass with successful authenticated request', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ 
          id: 'user-123',
          name: 'Test User',
        }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await authenticatedRequest()

      expect(assertionResults).toHaveLength(3)
      
      // $auth is defined
      expect(assertionResults[0].passed).toBe(true)
      
      // Status is 200 or auth error
      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 200,
        rightValue: '200 or 401/403',
      })

      // Data exists
      expect(assertionResults[2]).toMatchObject({
        passed: true,
        message: 'Successful response should contain data',
      })

      // Verify auth headers were included
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/user/profile',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer test-token-123',
          },
        }
      )
    })

    it('should pass with 401 auth error', async () => {
      const mockResponse = {
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Unauthorized' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await authenticatedRequest()

      expect(assertionResults).toHaveLength(2)
      
      // Status check passes (401 is acceptable)
      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 401,
        rightValue: '200 or 401/403',
      })
    })

    it('should pass with 403 auth error', async () => {
      const mockResponse = {
        status: 403,
        json: vi.fn().mockResolvedValue({ error: 'Forbidden' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await authenticatedRequest()

      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 403,
      })
    })

    it('should fail with unexpected status code', async () => {
      const mockResponse = {
        status: 500,
        json: vi.fn().mockResolvedValue({ error: 'Internal Server Error' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await authenticatedRequest()

      expect(assertionResults[1]).toMatchObject({
        passed: false,
        leftValue: 500,
        rightValue: '200 or 401/403',
      })
    })
  })

  describe('loginWithCredentials', () => {
    beforeEach(() => {
      ;(global as any).$server = {
        baseUrl: 'https://api.example.com',
        name: 'Test Server',
        id: 'server-123',
      }
      ;(global as any).$vars = {
        testUserEmail: 'test@example.com',
      }
      ;(global as any).$secrets = {
        testUserPassword: 'super-secret-password',
      }
    })

    it('should pass with successful login', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ 
          token: 'jwt-token-123',
          user: { id: 'user-123', email: 'test@example.com' },
        }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await loginWithCredentials()

      expect(assertionResults).toHaveLength(3)
      
      // Globals are defined
      expect(assertionResults[0].passed).toBe(true)
      
      // Status is 200 or 401
      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 200,
        rightValue: '200 or 401',
      })

      // Token exists
      expect(assertionResults[2]).toMatchObject({
        passed: true,
        leftValue: true,
        rightValue: true,
        message: 'Successful login should return a token',
      })

      // Verify credentials were sent
      expect(global.fetch).toHaveBeenCalledWith(
        'https://api.example.com/api/auth/login',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'super-secret-password',
          }),
        }
      )
    })

    it('should pass with invalid credentials (401)', async () => {
      const mockResponse = {
        status: 401,
        json: vi.fn().mockResolvedValue({ error: 'Invalid credentials' }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await loginWithCredentials()

      expect(assertionResults[1]).toMatchObject({
        passed: true,
        leftValue: 401,
        rightValue: '200 or 401',
      })
    })

    it('should handle accessToken instead of token', async () => {
      const mockResponse = {
        status: 200,
        json: vi.fn().mockResolvedValue({ 
          accessToken: 'access-token-123',
        }),
      }
      vi.mocked(global.fetch).mockResolvedValue(mockResponse as any)

      await loginWithCredentials()

      // Token assertion should pass with accessToken
      expect(assertionResults[2]).toMatchObject({
        passed: true,
        message: 'Successful login should return a token',
      })
    })

    it('should fail when credentials are missing', async () => {
      delete (global as any).$vars.testUserEmail

      await loginWithCredentials()

      expect(assertionResults).toHaveLength(2)
      
      // Globals check passes
      expect(assertionResults[0].passed).toBe(true)
      
      // Credentials check fails
      expect(assertionResults[1]).toMatchObject({
        passed: false,
        leftValue: 'missing credentials',
        rightValue: 'testUserEmail and testUserPassword',
        message: 'Test credentials should be configured in VarGroup',
      })

      // Fetch should not be called
      expect(global.fetch).not.toHaveBeenCalled()
    })

    it('should fail when $secrets is undefined', async () => {
      delete (global as any).$secrets

      await loginWithCredentials()

      expect(assertionResults[1]).toMatchObject({
        passed: false,
        message: 'Test credentials should be configured in VarGroup',
      })
    })
  })

  describe('Test Case Metadata', () => {
    it('healthCheck should have correct metadata', () => {
      expect(healthCheck.__meta__).toMatchObject({
        id: 'api-health-check',
        name: 'API Health Check',
        tags: ['smoke', 'api', 'health'],
        priority: 1,
        timeout: 10000,
      })
    })

    it('authenticatedRequest should have correct metadata', () => {
      expect(authenticatedRequest.__meta__).toMatchObject({
        id: 'api-authenticated-request',
        name: 'Authenticated API Request',
        tags: ['api', 'auth'],
        priority: 2,
        timeout: 10000,
      })
    })

    it('loginWithCredentials should have correct metadata', () => {
      expect(loginWithCredentials.__meta__).toMatchObject({
        id: 'api-login-credentials',
        name: 'Login with Credentials',
        tags: ['api', 'auth', 'login'],
        priority: 2,
        timeout: 10000,
      })
    })
  })
})
