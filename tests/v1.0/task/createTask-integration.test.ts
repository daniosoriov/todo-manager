import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import createTask from '@src/api/v1.0/task/createTask'
import fieldValidation from '@src/middleware/fieldValidation'
import createTaskValidators from '@src/validators/createTaskValidators'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task'

const mockedTask = {
  '_id': '67f5153450a07804c587f768',
  title: 'Test task',
  description: 'Test task description',
  status: 'pending',
  dueDate: '2026-03-23T00:00:00.000Z',
  creationDate: '2025-04-08T12:23:16.476Z',
  '__v': 0,
}

vi.mock('@src/models/Task', () => ({
  default: {
    create: vi.fn(),
  },
}))

describe('Create Task Integration Success', () => {
  app.post(path, createTaskValidators, fieldValidation, createTask)

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(Task.create).mockResolvedValueOnce(mockedTask)
  })

  it('should create a task successfully', async () => {
    const payload = {
      title: 'Test task',
      description: 'Test task description',
      status: 'pending',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockedTask)
    expect(Task.create).toHaveBeenCalledWith(payload)
  })

  it('should create a task even with no description', async () => {
    const payload = {
      title: 'Test task',
      status: 'pending',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockedTask)
    expect(Task.create).toHaveBeenCalledWith(payload)
  })

  it('should create a task even with no status', async () => {
    const payload = {
      title: 'Test task',
      description: 'Test task description',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockedTask)
    expect(Task.create).toHaveBeenCalledWith({ ...payload, status: 'pending' })
  })

  it('should create a task even with no description and status', async () => {
    const payload = {
      title: 'Test task',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockedTask)
    expect(Task.create).toHaveBeenCalledWith({ ...payload, status: 'pending' })
  })
})

describe('Create Task Integration Fail', () => {
  it('should fail when no title is provided', async () => {
    const response = await supertest(app).post(path).send({ description: 'Test task' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    const found = response.body.errors.some((error: any) => error.path === 'title' && error.location === 'body')
    expect(found).toBe(true)
  })

  it('should fail when no dueDate is provided', async () => {
    const response = await supertest(app).post(path).send({ title: 'Test task' })

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('errors')
    const found = response.body.errors.some((error: any) => error.path === 'dueDate' && error.location === 'body')
    expect(found).toBe(true)
  })
})
