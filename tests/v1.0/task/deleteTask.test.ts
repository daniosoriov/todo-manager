import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import deleteTask from '@src/api/v1.0/task/deleteTask'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.delete(path, deleteTask)

vi.mock('@src/models/Task', () => ({
  default: {
    findByIdAndDelete: vi.fn(),
  },
}))

describe('Delete task', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Cases', () => {
    it('should delete a task successfully', async () => {
      const taskId = '67f5153450a07804c587f768'
      vi.mocked(Task.findByIdAndDelete).mockResolvedValueOnce({ _id: taskId } as any)

      const response = await supertest(app).delete(path.replace(':taskId', taskId))

      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Task deleted successfully' })
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(taskId)
    })
  })

  describe('Failure Cases', () => {
    it('should return 404 when the task is not found', async () => {
      const taskId = '67f5153450a07804c587f768'
      vi.mocked(Task.findByIdAndDelete).mockResolvedValueOnce(null)

      const response = await supertest(app).delete(path.replace(':taskId', taskId))

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
      expect(Task.findByIdAndDelete).toHaveBeenCalledWith(taskId)
    })

    it('should return 404 for an invalid taskId format', async () => {
      const response = await supertest(app).delete(path.replace(':taskId', 'invalid-id'))

      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('should return 500 for database error', async () => {
      const taskId = '67f5153450a07804c587f768'
      vi.mocked(Task.findByIdAndDelete).mockRejectedValueOnce(new Error('Database error'))

      const response = await supertest(app).delete(path.replace(':taskId', taskId))

      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
    })
  })
})
