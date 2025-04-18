import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { reqAuth, res } from '@tests/utils/unitTestSetup'
import register from '@src/api/v1.0/auth/register'
import User from '@src/models/User'

vi.mock('@src/models/User', () => ({
  default: {
    create: vi.fn(),
  },
}))

console.error = vi.fn()

describe('Register User Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should register a user successfully', async () => {
    vi.mocked(User.create).mockResolvedValueOnce(reqAuth.body)
    await register(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully' })
    expect(User.create).toHaveBeenCalledWith(reqAuth.body)
  })

  it('should not register a user that already exists', async () => {
    vi.mocked(User.create).mockRejectedValueOnce({ code: 11000 })
    await register(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'Email already registered' })
  })

  it('should not register a user when there is a database error', async () => {
    vi.mocked(User.create).mockRejectedValueOnce(new Error('Database error'))
    await register(reqAuth as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
