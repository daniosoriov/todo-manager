import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import createTask from '@src/api/v1.0/task/createTask'
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

describe('Create Task Success', () => {
  app.post(path, createTask)

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
    expect(Task.create).toHaveBeenCalledWith(payload)
  })

  it('should create a task even with no description and status', async () => {
    const payload = {
      title: 'Test task',
      dueDate: '2026-03-23T00:00:00.000Z',
    }

    const response = await supertest(app).post(path).send(payload)
    expect(response.status).toBe(201)
    expect(response.body).toEqual(mockedTask)
    expect(Task.create).toHaveBeenCalledWith(payload)
  })
})

describe('Create Task Fail', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fail when no title is provided', async () => {
    vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: title is required'))

    const response = await supertest(app).post(path).send({ description: 'Test task' })

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error', 'Internal server error')
  })

  it('should fail when no dueDate is provided', async () => {
    vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: dueDate is required'))

    const response = await supertest(app).post(path).send({ title: 'Test task' })

    expect(response.status).toBe(500)
    expect(response.body).toHaveProperty('error', 'Internal server error')
  })
})
