import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { res } from '@tests/utils/unitTestSetup'
import createTask from '@src/api/v1.0/task/createTask'
import Task from '@src/models/Task'

vi.mock('@src/models/Task', () => ({
  default: {
    create: vi.fn(),
  },
}))

console.error = vi.fn()

const req = {
  user: {
    _id: 'userId',
  },
  body: {
    title: 'Test task',
    description: 'Test task description',
    status: 'pending',
    dueDate: '2026-03-23T00:00:00.000Z',
  },
} as Partial<Request>

describe('Create Task Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a task successfully', async () => {
    vi.mocked(Task.create).mockResolvedValueOnce(req.body)
    await createTask(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith(req.body)
    expect(Task.create).toHaveBeenCalledWith({ ...req.body, userId: req.user!._id })
  })

  it('should not create a task when there is a database error', async () => {
    vi.mocked(Task.create).mockRejectedValueOnce(new Error('Database error'))
    await createTask(req as Request, res as Response)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
