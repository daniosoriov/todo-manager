import { Request, Response, NextFunction } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reqAuth, res, next } from '@tests/utils/unitTestSetup'
import login from '@src/api/v1.0/auth/login'
import User from '@src/models/User'

vi.mock('@src/models/User', () => ({
  default: {
    findOne: vi.fn(),
  },
}))

console.error = vi.fn()

describe('Login User Unit Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should login a user successfully', async () => {
    const mockUser = {
      comparePassword: vi.fn().mockResolvedValueOnce(true),
      generateAuthToken: vi.fn().mockResolvedValueOnce('mockToken'),
    }
    vi.mocked(User.findOne).mockResolvedValueOnce(mockUser)
    await login(reqAuth as Request, res as Response, next as NextFunction)
    expect(res.json).toHaveBeenCalledWith({ token: 'mockToken' })
    expect(mockUser.comparePassword).toHaveBeenCalledWith(reqAuth.body.password)
    expect(mockUser.generateAuthToken).toHaveBeenCalled()
  })

  it('should return 401 for non-existent user', async () => {
    vi.mocked(User.findOne).mockResolvedValueOnce(null)
    await login(reqAuth as Request, res as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
  })

  it('should return 401 for invalid credentials', async () => {
    const mockUser = {
      comparePassword: vi.fn().mockResolvedValueOnce(false),
    }
    vi.mocked(User.findOne).mockResolvedValueOnce(mockUser)
    await login(reqAuth as Request, res as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' })
    expect(mockUser.comparePassword).toHaveBeenCalledWith(reqAuth.body.password)
  })

  it('should return 500 for server error', async () => {
    vi.mocked(User.findOne).mockRejectedValueOnce(new Error('Database error'))
    await login(reqAuth as Request, res as Response, next as NextFunction)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
