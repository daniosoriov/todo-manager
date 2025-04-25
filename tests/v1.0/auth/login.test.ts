import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reqAuth, res } from '@tests/utils/unitTestSetup'
import login from '@src/api/v1.0/auth/login'
import User from '@src/models/User'

vi.mock('@src/models/User', () => ({
  default: {
    findOne: vi.fn(),
  },
}))

vi.mock('@src/utils/generateAndStoreTokens', () => ({
  default: vi.fn().mockResolvedValue({
    newToken: 'mockToken',
    newRefreshToken: 'mockRefreshToken',
  }),
}))

console.error = vi.fn()

describe('Login User Unit Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should login a user successfully', async () => {
    const mockUser = {
      comparePassword: vi.fn().mockResolvedValueOnce(true),
    }
    vi.mocked(User.findOne).mockResolvedValueOnce(mockUser)
    await login(reqAuth as Request, res as Response)
    expect(res.json).toHaveBeenCalledWith({ token: 'mockToken', refreshToken: 'mockRefreshToken' })
    expect(mockUser.comparePassword).toHaveBeenCalledWith(reqAuth.body.password)
  })

  it('should return 401 for non-existent user', async () => {
    vi.mocked(User.findOne).mockResolvedValueOnce(null)
    await login(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
  })

  it('should return 401 for invalid credentials', async () => {
    const mockUser = {
      comparePassword: vi.fn().mockResolvedValueOnce(false),
    }
    vi.mocked(User.findOne).mockResolvedValueOnce(mockUser)
    await login(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' })
    expect(mockUser.comparePassword).toHaveBeenCalledWith(reqAuth.body.password)
  })

  it('should return 500 for server error', async () => {
    vi.mocked(User.findOne).mockRejectedValueOnce(new Error('Database error'))
    await login(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
