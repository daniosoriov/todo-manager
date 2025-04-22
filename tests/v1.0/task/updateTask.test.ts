import { Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { res, next, taskId } from '@tests/utils/unitTestSetup'
import updateTask from '@src/api/v1.0/task/updateTask'
import Task from '@src/models/Task'

vi.mock('@src/models/Task', () => ({
  default: {
    findOneAndUpdate: vi.fn(),
  },
}))

const body = {
  title: 'Updated task',
  description: 'Updated task description',
  status: 'completed',
  dueDate: '2026-03-23T00:00:00.000Z',
}

const req = {
  user: {
    _id: 'userId',
  },
  body,
  params: {
    taskId: taskId,
  },
} as Partial<Request>

console.error = vi.fn()

describe('Update Task Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should update a task successfully', async () => {
    vi.mocked(Task.findOneAndUpdate).mockResolvedValueOnce({ ...body, _id: taskId } as any)
    await updateTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Task updated successfully' })
    expect(Task.findOneAndUpdate).toHaveBeenCalledWith({ _id: taskId, userId: req.user!._id }, body, { new: true })
  })

  it('should fail to update a task when it does not exist', async () => {
    vi.mocked(Task.findOneAndUpdate).mockResolvedValueOnce(null)
    await updateTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' })
  })

  it('should fail to update a task when there are no updates', async () => {
    const emptyReq = { body: {}, params: { taskId } } as Partial<Request>
    await updateTask(emptyReq as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: 'No updates provided' })
  })

  it('should fail to update a task when there is a database error', async () => {
    vi.mocked(Task.findOneAndUpdate).mockRejectedValueOnce(new Error('Database error'))
    await updateTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
