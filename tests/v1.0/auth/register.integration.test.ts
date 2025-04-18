import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'

import registerValidators from '@src/validators/auth/registerValidators'
import fieldValidation from '@src/middleware/fieldValidation'
import register from '@src/api/v1.0/auth/register'
import User from '@src/models/User'

const app = express()
app.use(express.json())
const path = '/v1.0/auth/register'
app.post(path, registerValidators, fieldValidation, register)

const mockUser = {
  email: 'test@test.com',
  password: 'password123',
}
const userCreateSpy = vi.spyOn(User, 'create')
console.error = vi.fn()

describe('Register User Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Successful Cases', () => {
    it('should register a user successfully', async () => {
      const response = await supertest(app).post(path).send(mockUser)
      expect(response.status).toBe(201)
      expect(response.body).toHaveProperty('message', 'User registered successfully')
      expect(userCreateSpy).toHaveBeenCalledWith(mockUser)
    })
  })

  describe('Failure Cases', () => {
    it('should fail when email is already registered', async () => {
      const newMockUser = {
        email: 'testtest@test.com',
        password: 'password123',
      }
      await User.create(newMockUser)
      const response = await supertest(app).post(path).send(newMockUser)
      expect(response.status).toBe(400)
      expect(response.body).toHaveProperty('error', 'Email already registered')
    })

    describe('Missing fields', () => {
      it('should fail when no payload is provided', async () => {
        const response = await supertest(app).post(path).send({})
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expectExpressValidatorError(response, 'password')
        expect(userCreateSpy).not.toHaveBeenCalled()
      })
      it('should fail when email is not provided', async () => {
        const response = await supertest(app).post(path).send({ password: mockUser.password })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expect(userCreateSpy).not.toHaveBeenCalled()
      })
      it('should fail when password is not provided', async () => {
        const response = await supertest(app).post(path).send({ email: mockUser.email })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'password')
        expect(userCreateSpy).not.toHaveBeenCalled()
      })
    })

    describe('Invalid fields', () => {
      it('should fail when email is invalid', async () => {
        const payload = { email: 'invalid-email', password: mockUser.password }
        const response = await supertest(app).post(path).send(payload)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'email')
        expect(userCreateSpy).not.toHaveBeenCalled()
      })
      it('should fail when password is too short', async () => {
        const payload = { email: mockUser.email, password: 'short' }
        const response = await supertest(app).post(path).send(payload)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'password')
        expect(userCreateSpy).not.toHaveBeenCalled()
      })
    })

    it('should fail when there is a database error', async () => {
      userCreateSpy.mockRejectedValueOnce(new Error('Database error'))
      const response = await supertest(app).post(path).send(mockUser)
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
      expect(userCreateSpy).toHaveBeenCalledWith(mockUser)
    })
  })
})
