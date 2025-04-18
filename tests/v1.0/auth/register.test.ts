import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import register from '@src/api/v1.0/auth/register'
import User from '@src/models/User'

vi.mock('@src/models/User', () => ({
  default: {
    create: vi.fn(),
  },
}))

const req = {
  body: {
    email: 'test@test.com',
    password: 'password',
  },
} as Partial<Request>

const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as Partial<Response>

console.error = vi.fn()

describe('Register User Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a user successfully', async () => {
    vi.mocked(User.create).mockResolvedValueOnce(req.body)
    await register(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' })
    expect(User.create).toHaveBeenCalledWith(req.body)
  })

  it('should not register a user when there is a database error', async () => {
    vi.mocked(User.create).mockRejectedValueOnce(new Error('Database error'))
    await register(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
