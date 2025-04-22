import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'

import createTask from '@src/api/v1.0/task/createTask'
import validFieldsOnly from '@src/middleware/validFieldsOnly'
import fieldValidation from '@src/middleware/fieldValidation'
import createTaskValidators from '@src/validators/task/createTaskValidators'
import authJWT from '@src/middleware/authJWT'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task'
app.post(path, validFieldsOnly, createTaskValidators, fieldValidation, authJWT, createTask)

const jwtSecret = 'testSecret'
vi.stubEnv('JWT_SECRET', jwtSecret)
const token = jwt.sign({ _id: 'testUserId' }, jwtSecret, { expiresIn: '1h' })
const jwtVerifySpy = vi.spyOn(jwt, 'verify')
const taskCreateSpy = vi.spyOn(Task, 'create')
console.error = vi.fn()

describe('Create Task Integration Tests', () => {
  describe('Authorization', () => {
    it('should return 400 if no token is provided', async () => {
      const response = await supertest(app).post(path).send({
        title: 'Test task',
        dueDate: '2026-03-23T00:00:00.000Z',
      })
      expect(response.status).toBe(400)
      expectExpressValidatorError(response, 'authorization', 'headers')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskCreateSpy).not.toHaveBeenCalled()
    })

    it('should return 401 if an invalid token is provided', async () => {
      const invalidToken = 'invalidToken'
      const response = await supertest(app)
          .post(path)
          .set('Authorization', `Bearer ${invalidToken}`)
          .send({
            title: 'Test task',
            dueDate: '2026-03-23T00:00:00.000Z',
          })
      expect(response.status).toBe(401)
      expect(jwtVerifySpy).toHaveBeenCalledWith(invalidToken, jwtSecret)
      expect(response.body).toEqual({ message: 'Unauthorized' })
      expect(taskCreateSpy).not.toHaveBeenCalled()
    })
  })

  describe('Successful Cases', () => {
    beforeAll(async () => {
      await connectInMemoryDB()
    })

    beforeEach(() => {
      vi.clearAllMocks()
    })

    afterAll(async () => {
      await disconnectInMemoryDB()
    })

    it('should create a task successfully', async () => {
      const payload = {
        title: 'Test task',
        description: 'Test task description',
        status: 'pending',
        dueDate: '2026-03-23T00:00:00.000Z',
      }

      const response = await supertest(app)
          .post(path)
          .send(payload)
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(201)
      const newTask = response.body
      expect(newTask).toHaveProperty('_id')
      expect(newTask).toHaveProperty('title', payload.title)
      expect(newTask).toHaveProperty('description', payload.description)
      expect(newTask).toHaveProperty('status', payload.status)
      expect(newTask).toHaveProperty('dueDate', payload.dueDate)
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskCreateSpy).toHaveBeenCalledWith(payload)
    })

    it('should create a task even with no description', async () => {
      const payload = {
        title: 'Test task',
        status: 'pending',
        dueDate: '2026-03-23T00:00:00.000Z',
      }

      const response = await supertest(app)
          .post(path)
          .send(payload)
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(201)
      const newTask = response.body
      expect(newTask).toHaveProperty('_id')
      expect(newTask.description).toBeUndefined()
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskCreateSpy).toHaveBeenCalledWith(payload)
    })

    it('should create a task even with no status', async () => {
      const payload = {
        title: 'Test task',
        description: 'Test task description',
        dueDate: '2026-03-23T00:00:00.000Z',
      }

      const response = await supertest(app)
          .post(path)
          .send(payload)
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(201)
      const newTask = response.body
      expect(newTask).toHaveProperty('_id')
      expect(newTask).toHaveProperty('status', 'pending')
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskCreateSpy).toHaveBeenCalledWith({ ...payload, status: 'pending' })
    })

    it('should create a task even with no description and status', async () => {
      const payload = {
        title: 'Test task',
        dueDate: '2026-03-23T00:00:00.000Z',
      }

      const response = await supertest(app)
          .post(path)
          .send(payload)
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(201)
      const newTask = response.body
      expect(newTask).toHaveProperty('_id')
      expect(newTask.description).toBeUndefined()
      expect(newTask).toHaveProperty('status', 'pending')
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskCreateSpy).toHaveBeenCalledWith({ ...payload, status: 'pending' })
    })
  })

  describe('Failure Cases', () => {
    beforeEach(() => {
      vi.clearAllMocks()
    })

    describe('Missing Fields', () => {
      it('should fail when no payload is provided', async () => {
        const response = await supertest(app).post(path).send({}).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'title')
        expectExpressValidatorError(response, 'dueDate')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })

      it('should fail when no title is provided', async () => {
        const response = await supertest(app)
            .post(path)
            .send({ description: 'Test task' })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'title')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })

      it('should fail when no dueDate is provided', async () => {
        const response = await supertest(app)
            .post(path)
            .send({ title: 'Test task' })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })
    })

    describe('Invalid Fields', () => {
      it('should fail when invalid fields are provided', async () => {
        const payload = {
          title: 'Test task',
          dueDate: '2026-03-23T00:00:00.000Z',
          invalidField: 'invalidValue',
        }
        const response = await supertest(app)
            .post(path)
            .send(payload)
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })
    })

    describe('Empty Fields', () => {
      it('should fail when title is empty', async () => {
        const response = await supertest(app)
            .post(path)
            .send({
              title: '',
              description: 'Test task',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'title')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })

      it('should fail when dueDate is empty', async () => {
        const response = await supertest(app)
            .post(path)
            .send({
              title: 'Test task',
              dueDate: '',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })
    })

    describe('status', () => {
      it('should fail when status is not a valid enum value', async () => {
        const response = await supertest(app)
            .post(path)
            .send({
              title: 'Test task',
              dueDate: '2026-03-23T00:00:00.000Z',
              status: 'invalidStatus',
            })
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'status')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })
    })

    describe('dueDate', () => {
      it('should fail when dueDate is not a valid date', async () => {
        const response = await supertest(app)
            .post(path)
            .send({
              title: 'Test task',
              dueDate: 'not valid date',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })

      it('should fail when dueDate is in the past', async () => {
        const response = await supertest(app)
            .post(path)
            .send({
              title: 'Test task',
              dueDate: '1990-03-23T00:00:00.000Z',
            })
            .set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(jwtVerifySpy).not.toHaveBeenCalled()
        expect(taskCreateSpy).not.toHaveBeenCalled()
      })
    })
  })
})
