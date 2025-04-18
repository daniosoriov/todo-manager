import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '../../utils/expectExpressValidatorError'

import deleteTask from '@src/api/v1.0/task/deleteTask'
import fieldValidation from '@src/middleware/fieldValidation'
import deleteTaskValidators from '../../../src/validators/task/deleteTaskValidators'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.delete(path, deleteTaskValidators, fieldValidation, deleteTask)

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

      const response = await supertest(app).delete(path.replace(':taskId', taskId))
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Task deleted successfully' })
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(taskId)
    })
  })

  describe('Failure Cases', () => {
    it('should return a 404 error if the task does not exist', async () => {
      const nonExistentTaskId = '67ff95ce036a26e20e4b3303'
      const response = await supertest(app).delete(path.replace(':taskId', nonExistentTaskId))
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(nonExistentTaskId)
    })

    it('should return a 400 error for invalid taskId format', async () => {
      const response = await supertest(app).delete(path.replace(':taskId', 'invalidTaskId'))
      expect(response.status).toBe(400)
      expectExpressValidatorError(response, 'taskId', 'params')
      expect(taskFindByIdAndDeleteSpy).not.toHaveBeenCalled()
    })

    it('should return a 500 error if there is a database error', async () => {
      taskFindByIdAndDeleteSpy.mockRejectedValueOnce(new Error('Server error'))
      const taskId = '67ff95ce036a26e20e4b3303'
      const response = await supertest(app).delete(path.replace(':taskId', taskId))
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(taskFindByIdAndDeleteSpy).toHaveBeenCalledWith(taskId)
    })
  })
})
