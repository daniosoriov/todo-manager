import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '../../utils/expectExpressValidatorError'

import updateTask from '@src/api/v1.0/task/updateTask'
import validFieldsOnly from '../../../src/middleware/validFieldsOnly'
import fieldValidation from '@src/middleware/fieldValidation'
import updateTaskValidators from '@src/validators/updateTaskValidators'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.put(path, validFieldsOnly, updateTaskValidators, fieldValidation, updateTask)

const mockedTask = {
  title: 'Test task',
  description: 'Test task description',
  status: 'pending',
  dueDate: '2036-03-23T00:00:00.000Z',
  creationDate: new Date('2025-04-08T12:23:16.476Z'),
}
let taskId: string
const taskFindByIdAndUpdateSpy = vi.spyOn(Task, 'findByIdAndUpdate')

async function successfulUpdate(payload: Partial<typeof Task.schema.obj>) {
  const response = await supertest(app).put(path.replace(':taskId', taskId)).send(payload)
  expect(response.status).toBe(200)
  expect(response.body).toEqual({ message: 'Task updated successfully' })
  expect(taskFindByIdAndUpdateSpy).toHaveBeenCalledWith(taskId, payload, { new: true })
}

describe('Update Task Integration Tests', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    // Insert a task into the in-memory database
    const createdTask = await Task.create(mockedTask)
    taskId = createdTask._id.toString()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  describe('Successful Cases', () => {
    it('should update a task description only', async () => {
      const payload = {
        title: 'Updated task',
        description: 'Updated task description',
        status: 'completed' as const,
      }
      await successfulUpdate(payload)
    })

    it('should only update a task title', async () => {
      const payload = {
        title: 'Updated task',
      }
      await successfulUpdate(payload)
      const updatedTask = await Task.findById(taskId)
      expect(updatedTask).toBeDefined()
      expect(updatedTask?.title).toBe(payload.title)
      expect(updatedTask?.description).toBe(mockedTask.description)
      expect(updatedTask?.status).toBe(mockedTask.status)
      expect(updatedTask?.dueDate.toISOString()).toEqual(mockedTask.dueDate)
    })

    it('should only update a task status', async () => {
      const payload = {
        status: 'completed' as const,
      }
      await successfulUpdate(payload)
      const updatedTask = await Task.findById(taskId)
      expect(updatedTask).toBeDefined()
      expect(updatedTask?.status).toBe(payload.status)
      expect(updatedTask?.title).toBe(mockedTask.title)
      expect(updatedTask?.description).toBe(mockedTask.description)
      expect(updatedTask?.dueDate.toISOString()).toEqual(mockedTask.dueDate)
    })

    it('should only update a task dueDate', async () => {
      const payload = {
        dueDate: '2027-03-23T00:00:00.000Z',
      }
      await successfulUpdate(payload)
      const updatedTask = await Task.findById(taskId)
      expect(updatedTask).toBeDefined()
      expect(updatedTask?.dueDate.toISOString()).toEqual(payload.dueDate)
      expect(updatedTask?.title).toBe(mockedTask.title)
      expect(updatedTask?.description).toBe(mockedTask.description)
      expect(updatedTask?.status).toBe(mockedTask.status)
    })
  })

  describe('Failure Cases', () => {
    describe('payload', () => {
      it('should return 400 error for empty payload', async () => {
        const response = await supertest(app).put(path.replace(':taskId', taskId)).send({})
        expect(response.status).toBe(400)
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })

      it('should return 400 error for invalid payload', async () => {
        const response = await supertest(app).put(path.replace(':taskId', taskId)).send({ invalidField: 'invalidValue' })
        expect(response.status).toBe(400)
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })
    })

    describe('taskId', () => {
      it('should return a 400 error for invalid taskId format', async () => {
        const response = await supertest(app).put(path.replace(':taskId', 'invalid-id')).send({ title: 'New title' })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'taskId', 'params')
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })

      it('should return a 404 error for non-existing taskId', async () => {
        const nonExistingTaskId = '603d2f4e4f1a2c001f8b4567'
        const response = await supertest(app).put(path.replace(':taskId', nonExistingTaskId)).send({ title: 'New title' })
        expect(response.status).toBe(404)
        expect(response.body).toEqual({ error: 'Task not found' })
      })
    })

    describe('status', () => {
      it('should return validation error for invalid status', async () => {
        const payload = {
          status: 'invalid-status' as const,
        }
        const response = await supertest(app).put(path.replace(':taskId', taskId)).send(payload)
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'status')
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })
    })

    describe('dueDate', () => {
      it('should fail when dueDate is not a valid date', async () => {
        const response = await supertest(app).put(path.replace(':taskId', taskId)).send({ dueDate: 'not valid date' })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })

      it('should fail when dueDate is in the past', async () => {
        const response = await supertest(app).put(path.replace(':taskId', taskId)).send({ dueDate: '1990-03-23T00:00:00.000Z' })
        expect(response.status).toBe(400)
        expectExpressValidatorError(response, 'dueDate')
        expect(taskFindByIdAndUpdateSpy).not.toHaveBeenCalled()
      })
    })
  })
})

