import { Request, Response, NextFunction } from 'express'
import { describe, it, expect, vi } from 'vitest'
import jwt from 'jsonwebtoken'
import { res, next } from '@tests/utils/unitTestSetup'
import authRefreshToken from '@src/middleware/authRefreshToken'

const jwtRefreshSecret = 'testRefreshSecret'
vi.stubEnv('JWT_REFRESH_SECRET', jwtRefreshSecret)
const jwtVerifySpy = vi.spyOn(jwt, 'verify')
console.error = vi.fn()

const createMockRequest = (token: string | null): Partial<Request> => {
  return token ? { body: { token } } : {}
}

const runUnauthorizedTest = (token: string | null, error: Error | null) => {
  const req = createMockRequest(token)
  if (error) {
    jwtVerifySpy.mockImplementation(() => {
      throw error
    })
  }

  authRefreshToken(req as Request, res as Response, next as NextFunction)

  expect(res.status).toHaveBeenCalledWith(401)
  expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' })
}

describe('Auth Refresh JWT', () => {
  it('should call next() if token is valid', () => {
    const token = jwt.sign({ _id: 'testId' }, jwtRefreshSecret, { expiresIn: '7d' })
    const req = createMockRequest(token)

    authRefreshToken(req as Request, res as Response, next as NextFunction)

    expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtRefreshSecret)
    expect(req?.user).toEqual({ _id: 'testId', iat: expect.any(Number), exp: expect.any(Number) })
    expect(next).toHaveBeenCalled()
  })

  it('should return 401 if token is missing', () => {
    runUnauthorizedTest(null, null)
  })

  it('should return 401 if token is invalid', () => {
    runUnauthorizedTest('invalidToken', new jwt.JsonWebTokenError('invalid token'))
  })

  it('should return 401 if token is expired', () => {
    runUnauthorizedTest('expiredToken', new jwt.TokenExpiredError('jwt expired', new Date()))
  })

  it('should return 401 if token has invalid signature', () => {
    runUnauthorizedTest('invalidSignatureToken', new jwt.JsonWebTokenError('invalid signature'))
  })

  it('should return 401 if token is malformed', () => {
    runUnauthorizedTest('malformedToken', new jwt.JsonWebTokenError('jwt malformed'))
  })
})
