import express from 'express'
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest'
import supertest from 'supertest'
import { connectInMemoryDB, disconnectInMemoryDB } from '@tests/utils/mongoMemoryServer'
import expectExpressValidatorError from '../../utils/expectExpressValidatorError'

import getTask from '@src/api/v1.0/task/getTask'
import fieldValidation from '@src/middleware/fieldValidation'
import getTaskValidators from '@src/validators/getTaskValidators'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.get(path, getTaskValidators, fieldValidation, getTask)

describe('Successful Cases', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  it('should get a task successfully', async () => {
    // Insert a task into the in-memory database
    const mockedTask = await Task.create({
      title: 'Test task',
      description: 'Test task description',
      status: 'pending',
      dueDate: '2036-03-23T00:00:00.000Z',
      creationDate: new Date('2025-04-08T12:23:16.476Z'),
    })

    const taskId = mockedTask._id.toString()
    const taskFindByIdSpy = vi.spyOn(Task, 'findById')
    const response = await supertest(app).get(path.replace(':taskId', taskId))

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      _id: taskId,
      title: mockedTask.title,
      description: mockedTask.description,
      status: mockedTask.status,
      dueDate: mockedTask.dueDate.toISOString(),
      creationDate: mockedTask.creationDate.toISOString(),
      __v: mockedTask.__v,
    })
    expect(taskFindByIdSpy).toHaveBeenCalledWith(taskId)
  })
})

describe('Failure Cases', () => {
  beforeAll(async () => {
    await connectInMemoryDB()
  })

  afterAll(async () => {
    await disconnectInMemoryDB()
  })

  it('should return a 400 error for invalid taskId format', async () => {
    const response = await supertest(app).get(path.replace(':taskId', 'invalidTaskId'))
    expect(response.status).toBe(400)
    console.log(response.body)
    expectExpressValidatorError(response, 'taskId', 'params')
  })

  it('should return a 404 error for non-existing taskId', async () => {
    const nonExistingTaskId = '603d2f4e4f1a2c001f8b4567'
    const response = await supertest(app).get(path.replace(':taskId', nonExistingTaskId))
    expect(response.status).toBe(404)
    expect(response.body).toEqual({ error: 'Task not found' })
  })

  it('should fail when no taskId is provided', async () => {
    const response = await supertest(app).get(path.replace(':taskId', ''))
    expect(response.status).toBe(404)
    expect(response.body).toEqual({})
  })

  it('should return a 500 error for database error', async () => {
    const taskId = '603d2f4e4f1a2c001f8b4567'
    vi.spyOn(Task, 'findById').mockImplementationOnce(() => {
      throw new Error('Database error')
    })

    const response = await supertest(app).get(path.replace(':taskId', taskId))
    expect(response.status).toBe(500)
    expect(response.body).toEqual({ error: 'Internal Server Error' })
  })
})
