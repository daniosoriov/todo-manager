import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'

import loginValidators from '@src/validators/auth/loginValidators'
import fieldValidation from '@src/middleware/fieldValidation'
import login from '@src/api/v1.0/auth/login'
import User from '@src/models/User'

const app = express()
app.use(express.json())
const path = '/v1.0/auth/login'
app.post(path, loginValidators, fieldValidation, login)

const mockUser = {
  email: 'test@test.com',
  password: 'password123',
}
const userFindOneSpy = vi.spyOn(User, 'findOne')
console.error = vi.fn()

describe('Login User Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
    await User.create(mockUser)
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Successful Cases', () => {
    it('should login a user successfully', async () => {
      const response = await supertest(app).post(path).send(mockUser)
      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty('token')
      expect(response.body).toHaveProperty('refreshToken')
      expect(userFindOneSpy).toHaveBeenCalledWith({ email: mockUser.email })
    })
  })

  describe('Failure cases', () => {
    describe('Missing fields', () => {
      it('should fail when no payload is provided', async () => {
        const response = await supertest(app).post(path).send({})
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expectExpressValidatorError(response, 'password')
        expect(userFindOneSpy).not.toHaveBeenCalled()
      })
      it('should fail when email is not provided', async () => {
        const response = await supertest(app).post(path).send({ password: mockUser.password })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expect(userFindOneSpy).not.toHaveBeenCalled()
      })
      it('should fail when password is not provided', async () => {
        const response = await supertest(app).post(path).send({ email: mockUser.email })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'password')
        expect(userFindOneSpy).not.toHaveBeenCalled()
      })
    })

    describe('Invalid fields', () => {
      it('should fail when email is invalid', async () => {
        const response = await supertest(app).post(path).send({ email: 'invalidEmail', password: mockUser.password })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expect(userFindOneSpy).not.toHaveBeenCalled()
      })
      it('should fail when password is too short', async () => {
        const response = await supertest(app).post(path).send({ email: mockUser.email, password: 'short' })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'password')
        expect(userFindOneSpy).not.toHaveBeenCalled()
      })
    })

    it('should not login a user with invalid credentials', async () => {
      const unauthorizedEmail = 'asd@test.com'
      const response = await supertest(app).post(path).send({ email: unauthorizedEmail, password: 'password123' })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ message: 'Invalid credentials' })
      expect(userFindOneSpy).toHaveBeenCalledWith({ email: unauthorizedEmail })
    })

    it('should not login a valid user with invalid password', async () => {
      const invalidPassword = 'wrongPassword'
      const response = await supertest(app).post(path).send({ email: mockUser.email, password: invalidPassword })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ message: 'Invalid credentials' })
      expect(userFindOneSpy).toHaveBeenCalledWith({ email: mockUser.email })
    })

    it('should return 500 for server error', async () => {
      userFindOneSpy.mockImplementationOnce(() => {
        throw new Error('Database error')
      })
      const response = await supertest(app).post(path).send(mockUser)
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(userFindOneSpy).toHaveBeenCalledWith({ email: mockUser.email })
    })
  })
})
