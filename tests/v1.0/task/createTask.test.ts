import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import createTask from '@src/api/v1.0/task/createTask'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task'
app.post(path, createTask)

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

describe('Successful Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(Task.create).mockResolvedValueOnce({ ...mockedTask, toObject: () => mockedTask } as any)
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

describe('Failure Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('payload', () => {
    it('should fail when no payload is provided', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: payload is required'))
      const response = await supertest(app).post(path).send({})
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })

    it('should fail when payload contains invalid fields', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: invalid fields'))
      const response = await supertest(app).post(path).send({ title: 'Test task', invalidField: 'invalid' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })
  })

  describe('title', () => {
    it('should fail when no title is provided', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: title is required'))
      const response = await supertest(app).post(path).send({ description: 'Test task' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })

    it('should fail when title is not a string', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: title must be a string'))
      const response = await supertest(app).post(path).send({ title: 123, description: 'Test task' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })
  })

  describe('dueDate', () => {
    it('should fail when no dueDate is provided', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: dueDate is required'))
      const response = await supertest(app).post(path).send({ title: 'Test task' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })

    it('should fail when dueDate is not a date', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: dueDate must be a valid date'))
      const response = await supertest(app).post(path).send({ title: 'Test task', dueDate: 'invalid-date' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })

    it('should fail when dueDate is in the past', async () => {
      vi.mocked(Task.create).mockRejectedValueOnce(new Error('Task validation failed: dueDate cannot be in the past'))
      const response = await supertest(app).post(path).send({ title: 'Test task', dueDate: '1990-01-01T00:00:00.000Z' })
      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
    })
  })
})
