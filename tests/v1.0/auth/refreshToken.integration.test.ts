import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import generateAndStoreTokens from '@src/utils/generateAndStoreTokens'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'

import refreshTokenValidators from '@src/validators/auth/refreshTokenValidators'
import fieldValidation from '@src/middleware/fieldValidation'
import refreshToken from '@src/api/v1.0/auth/refreshToken'
import authRefreshToken from '@src/middleware/authRefreshToken'
import rateLimiter, { RATE_LIMITER_LIMIT } from '@src/middleware/rateLimiter'
import User from '@src/models/User'
import Token from '@src/models/Token'

const app = express()
app.use(express.json())
const path = '/v1.0/auth/refresh-token'
app.post(path, rateLimiter, refreshTokenValidators, fieldValidation, authRefreshToken, refreshToken)

const jwtSecret = 'testSecret'
const jwtRefreshSecret = 'testRefreshSecret'
vi.stubEnv('JWT_SECRET', jwtSecret)
vi.stubEnv('JWT_REFRESH_SECRET', jwtRefreshSecret)
const jwtVerifySpy = vi.spyOn(jwt, 'verify')
const tokenFindOneSpy = vi.spyOn(Token, 'findOne')
const userFindByIdSpy = vi.spyOn(User, 'findById')
console.error = vi.fn()

let user: InstanceType<typeof User>
let userId: string
let testToken: string
let testRefreshToken: string

describe('Refresh Token Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
    user = await User.create({ email: 'test@test', password: 'password' })
    userId = user._id.toString()
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    const result = await generateAndStoreTokens(user)
    testToken = result.newToken
    testRefreshToken = result.newRefreshToken
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Successful Cases', () => {
    it('should refresh the token successfully', async () => {
      const response = await supertest(app)
          .post(path)
          .send({ token: testRefreshToken })
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('refreshToken')
      expect(jwtVerifySpy).toHaveBeenCalledWith(testRefreshToken, jwtRefreshSecret)
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ userId, token: testRefreshToken })
      expect(userFindByIdSpy).toHaveBeenCalledWith(userId)
      expect(response.body.token).not.toEqual(testToken)
      expect(response.body.refreshToken).not.toEqual(testRefreshToken)
    })
  })

  describe('Failure Cases', () => {
    it('should return 400 for no refresh token', async () => {
      const response = await supertest(app)
          .post(path)
      expectExpressValidatorError(response, 'token', 'body')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(tokenFindOneSpy).not.toHaveBeenCalled()
      expect(userFindByIdSpy).not.toHaveBeenCalled()
    })

    it('should return 401 for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalidRefreshToken'
      const response = await supertest(app)
          .post(path)
          .send({ token: invalidRefreshToken })
      expect(response.status).toBe(401)
      expect(jwtVerifySpy).toHaveBeenCalledWith(invalidRefreshToken, jwtRefreshSecret)
      expect(tokenFindOneSpy).not.toHaveBeenCalled()
      expect(userFindByIdSpy).not.toHaveBeenCalled()
    })

    it('should return 401 for non-existent user', async () => {
      userFindByIdSpy.mockResolvedValueOnce(null)

      const response = await supertest(app)
          .post(path)
          .send({ token: testRefreshToken })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ error: 'User not found' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(testRefreshToken, jwtRefreshSecret)
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ userId, token: testRefreshToken })
      expect(userFindByIdSpy).toHaveBeenCalledWith(userId)
    })

    it('should return 401 for expired refresh token', async () => {
      const expiredToken = jwt.sign({ _id: userId }, jwtRefreshSecret, { expiresIn: -1 })
      const response = await supertest(app)
          .post(path)
          .send({ token: expiredToken })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ error: 'Unauthorized' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(expiredToken, jwtRefreshSecret)
      expect(tokenFindOneSpy).not.toHaveBeenCalled()
      expect(userFindByIdSpy).not.toHaveBeenCalled()
    })

    it('should return 500 for database error', async () => {
      tokenFindOneSpy.mockImplementationOnce(() => {
        throw new Error('Database error')
      })

      const response = await supertest(app)
          .post(path)
          .send({ token: testRefreshToken })
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(testRefreshToken, jwtRefreshSecret)
      expect(tokenFindOneSpy).toHaveBeenCalledWith({ userId, token: testRefreshToken })
      expect(userFindByIdSpy).not.toHaveBeenCalled()
    })

    it('should return 429 after exceeding the rate limit', async () => {
      const maxRequests = RATE_LIMITER_LIMIT
      let successfulRequests = 0

      for (let i = 0; i < maxRequests + 10; i++) {
        const response = await supertest(app)
            .post(path)
            .send({ token: testRefreshToken })
        testRefreshToken = response.body.refreshToken
        if (response.status === 429) {
          expect(response.body).toEqual({ error: 'Too many requests, please try again later.' })
        } else {
          expect(response.status).toBe(200)
          successfulRequests++
        }
      }
      expect(successfulRequests).toBeLessThanOrEqual(maxRequests)
    })
  })
})
