import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '@tests/utils/expectExpressValidatorError'

import deleteTask from '@src/api/v1.0/task/deleteTask'
import fieldValidation from '@src/middleware/fieldValidation'
import deleteTaskValidators from '@src/validators/task/deleteTaskValidators'
import authJWT from '@src/middleware/authJWT'
import Task from '@src/models/Task'
import jwt from 'jsonwebtoken'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.delete(path, deleteTaskValidators, fieldValidation, authJWT, deleteTask)

const jwtSecret = 'testSecret'
vi.stubEnv('JWT_SECRET', jwtSecret)
const token = jwt.sign({ _id: 'testUserId' }, jwtSecret, { expiresIn: '1h' })
const jwtVerifySpy = vi.spyOn(jwt, 'verify')
const taskFindByIdAndDeleteSpy = vi.spyOn(Task, 'findByIdAndDelete')
console.error = vi.fn()

describe('Delete Task Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
  })

  beforeEach(async () => {
    vi.clearAllMocks()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Authorization', () => {
    it('should return 400 if no token is provided', async () => {
      const response = await supertest(app).delete(path.replace(':taskId', '67ff95ce036a26e20e4b3303'))
      expectExpressValidatorError(response, 'authorization', 'headers')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskFindByIdAndDeleteSpy).not.toHaveBeenCalled()
    })

    it('should return 401 if an invalid token is provided', async () => {
      const invalidToken = 'invalidToken'
      const response = await supertest(app)
          .delete(path.replace(':taskId', '67ff95ce036a26e20e4b3303'))
          .set('Authorization', `Bearer ${invalidToken}`)
      expect(response.status).toBe(401)
      expect(jwtVerifySpy).toHaveBeenCalledWith(invalidToken, jwtSecret)
      expect(response.body).toEqual({ error: 'Unauthorized' })
    })
  })

  describe('Successful Cases', () => {
    it('should delete a task', async () => {
      const mockedTask = {
        title: 'Test task',
        description: 'Test task description',
        status: 'pending',
        dueDate: '2036-03-23T00:00:00.000Z',
        creationDate: new Date('2025-04-08T12:23:16.476Z'),
      }
      const createdTask = await Task.create(mockedTask)
      const taskId = createdTask._id.toString()

      const response = await supertest(app)
          .delete(path.replace(':taskId', taskId))
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Task deleted successfully' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(taskId)
    })
  })

  describe('Failure Cases', () => {
    it('should return a 404 error if the task does not exist', async () => {
      const nonExistentTaskId = '67ff95ce036a26e20e4b3303'
      const response = await supertest(app)
          .delete(path.replace(':taskId', nonExistentTaskId))
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(nonExistentTaskId)
    })

    it('should return a 400 error for invalid taskId format', async () => {
      const response = await supertest(app)
          .delete(path.replace(':taskId', 'invalidTaskId'))
          .set('Authorization', `Bearer ${token}`)
      expectExpressValidatorError(response, 'taskId', 'params')
      expect(jwtVerifySpy).not.toHaveBeenCalled()
      expect(taskFindByIdAndDeleteSpy).not.toHaveBeenCalled()
    })

    it('should return a 500 error if there is a database error', async () => {
      taskFindByIdAndDeleteSpy.mockRejectedValueOnce(new Error('Server error'))
      const taskId = '67ff95ce036a26e20e4b3303'
      const response = await supertest(app)
          .delete(path.replace(':taskId', taskId))
          .set('Authorization', `Bearer ${token}`)
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(jwtVerifySpy).toHaveBeenCalledWith(token, jwtSecret)
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(taskId)
    })
  })
})
