import { NextFunction, Request, Response } from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import deleteTask from '@src/api/v1.0/task/deleteTask'
import Task from '@src/models/Task'

vi.mock('@src/models/Task', () => ({
  default: {
    findByIdAndDelete: vi.fn(),
  },
}))

const taskId = '67f5153450a07804c587f768'

const req = {
  params: { taskId },
} as Partial<Request>

const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as Partial<Response>

const next = vi.fn() as NextFunction

describe('Delete Task Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should delete a task successfully', async () => {
    vi.mocked(Task.findByIdAndDelete).mockResolvedValueOnce({ _id: taskId } as any)
    await deleteTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' })
    expect(Task.findByIdAndDelete).toHaveBeenCalledWith(taskId)
  })

  it('should fail to delete a task when it does not exist', async () => {
    vi.mocked(Task.findByIdAndDelete).mockResolvedValueOnce(null)
    await deleteTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' })
  })

  it('should fail to delete a task when there is a database error', async () => {
    vi.mocked(Task.findByIdAndDelete).mockRejectedValueOnce(new Error('Database error'))
    await deleteTask(req as Request, res as Response, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' })
  })
})
