import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import jwt from 'jsonwebtoken'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'
import createTestUserAndToken from '@tests/utils/createTestUserAndToken'

import getTask from '@src/api/v1.0/task/getTask'
import fieldValidation from '@src/middleware/fieldValidation'
import getTaskValidators from '@src/validators/task/getTaskValidators'
import authJWT from '@src/middleware/authJWT'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.get(path, getTaskValidators, fieldValidation, authJWT, getTask)

const jwtSecret = 'testSecret'
vi.stubEnv('JWT_SECRET', jwtSecret)
const jwtVerifySpy = vi.spyOn(jwt, 'verify')
const taskFindOneSpy = vi.spyOn(Task, 'findOne')
console.error = vi.fn()

let userId: string
let token: string

describe('Get Task Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
    const result = await createTestUserAndToken('test@test.com', 'password', jwtSecret)
    userId = result.userId
    token = result.token
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Authorization', () => {
    it('should return 400 if no token is provided', async () => {
      const response = await supertest(app).get(path.replace(':taskId', '603d2f4e4f1a2c001f8b4567'))
      expectExpressValidatorError(response, 'authorization', 'headers')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskFindOneSpy).not.toHaveBeenCalled()
    })

    it('should return 401 if an invalid token is provided', async () => {
      const invalidToken = 'invalidToken'
      const response = await supertest(app)
          .get(path.replace(':taskId', '603d2f4e4f1a2c001f8b4567'))
          .set('Authorization', `Bearer ${invalidToken}`)
      expect(response.status).toBe(401)
      expect(jwtVerifySpy).toHaveBeenCalledWith(invalidToken, jwtSecret)
      expect(response.body).toEqual({ error: 'Unauthorized' })
    })
  })

  describe('Successful Cases', () => {
    it('should get a task successfully', async () => {
      // Insert a task into the in-memory database
      const mockedTask = await Task.create({
        title: 'Test task',
        description: 'Test task description',
        status: 'pending',
        dueDate: '2036-03-23T00:00:00.000Z',
        userId,
      })

      const taskId = mockedTask._id.toString()
      const response = await supertest(app)
          .get(path.replace(':taskId', taskId))
          .set('Authorization', `Bearer ${token}`)

      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(response.status).toBe(200)
      expect(response.body._id).toBe(taskId)
      expect(response.body.userId).toBe(userId)
      expect(response.body.title).toBe(mockedTask.title)
      expect(response.body.description).toBe(mockedTask.description)
      expect(response.body.status).toBe(mockedTask.status)
      expect(response.body.dueDate).toBe(mockedTask.dueDate.toISOString())
      expect(response.body.__v).toBe(mockedTask.__v)
      expect(taskFindOneSpy).toHaveBeenCalledWith({ _id: taskId, userId })
    })
  })

  describe('Failure Cases', () => {
    it('should return a 400 error for invalid taskId format', async () => {
      const response = await supertest(app)
          .get(path.replace(':taskId', 'invalidTaskId'))
          .set('Authorization', `Bearer ${token}`)
      expectExpressValidatorError(response, 'taskId', 'params')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskFindOneSpy).not.toHaveBeenCalled()
    })

    it('should return a 404 error for non-existing taskId', async () => {
      const nonExistingTaskId = '603d2f4e4f1a2c001f8b4567'
      const response = await supertest(app)
          .get(path.replace(':taskId', nonExistingTaskId))
          .set('Authorization', `Bearer ${token}`)
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
      expect(taskFindOneSpy).toHaveBeenCalledWith({ _id: nonExistingTaskId, userId })
    })

    it('should fail when no taskId is provided', async () => {
      const response = await supertest(app)
          .get(path.replace(':taskId', ''))
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({})
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskFindOneSpy).not.toHaveBeenCalled()
    })

    it('should return a 500 error for database error', async () => {
      const taskId = '603d2f4e4f1a2c001f8b4567'
      taskFindOneSpy.mockImplementationOnce(() => {
        throw new Error('Database error')
      })
      const response = await supertest(app)
          .get(path.replace(':taskId', taskId))
          .set('Authorization', `Bearer ${token}`)
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(taskFindOneSpy).toHaveBeenCalledWith({ _id: taskId, userId })
    })
  })
})
