import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { res } from '@tests/utils/unitTestSetup'
import refreshToken from '@src/api/v1.0/auth/refreshToken'
import Token from '@src/models/Token'
import User from '@src/models/User'

const req = {
  body: {
    token: 'token',
  },
  user: {
    _id: 'userId',
  },
} as Partial<Request>

vi.mock('@src/models/Token', () => ({
  default: {
    findOne: vi.fn(),
  },
}))

vi.mock('@src/models/User', () => ({
  default: {
    findById: vi.fn(),
  },
}))

vi.mock('@src/utils/generateAndStoreTokens', () => ({
  default: vi.fn().mockResolvedValue({
    newToken: 'mockToken',
    newRefreshToken: 'mockRefreshToken',
  }),
}))

console.error = vi.fn()

describe('Refresh Token Unit Tests', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
  })

  it('should refresh the token successfully', async () => {
    vi.mocked(Token.findOne).mockResolvedValueOnce({ token: 'mockToken' })
    vi.mocked(User.findById).mockResolvedValueOnce({ _id: 'userId' })
    await refreshToken(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ token: 'mockToken', refreshToken: 'mockRefreshToken' })
  })

  it('should return 401 for invalid refresh token', async () => {
    vi.mocked(Token.findOne).mockResolvedValueOnce(null)
    await refreshToken(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid refresh token' })
  })

  it('should return 401 for non-existent user', async () => {
    vi.mocked(Token.findOne).mockResolvedValueOnce({ token: 'mockToken' })
    vi.mocked(User.findById).mockResolvedValueOnce(null)
    await refreshToken(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' })
  })

  it('should return 500 for server error', async () => {
    vi.mocked(Token.findOne).mockRejectedValueOnce(new Error('Database error'))
    await refreshToken(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
