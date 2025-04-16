import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import getTask from '@src/api/v1.0/task/getTask'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.get(path, getTask)

vi.mock('@src/models/Task', () => ({
  default: {
    findById: vi.fn(),
  },
}))

describe('Get Task', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Cases', () => {
    it('should return a task when it exists', async () => {
      const mockTask = {
        _id: '67f5153450a07804c587f768',
        title: 'Test task',
        description: 'Test task description',
        status: 'pending',
        dueDate: '2026-03-23T00:00:00.000Z',
      }
      vi.mocked(Task.findById).mockResolvedValueOnce(mockTask as any)

      const response = await supertest(app).get('/v1.0/task/67f5153450a07804c587f768')

      expect(response.status).toBe(200)
      expect(response.body).toEqual(mockTask)
      expect(Task.findById).toHaveBeenCalledWith('67f5153450a07804c587f768')
    })

  })

  describe('Failure Cases', () => {
    it('should return 404 when the task is not found', async () => {
      vi.mocked(Task.findById).mockResolvedValueOnce(null)

      const response = await supertest(app).get('/v1.0/task/67f5153450a07804c587f768')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Task not found')
      expect(Task.findById).toHaveBeenCalledWith('67f5153450a07804c587f768')
    })

    it('should return 404 for an invalid taskId format', async () => {
      const response = await supertest(app).get('/v1.0/task/invalid-id')

      expect(response.status).toBe(404)
      expect(response.body).toHaveProperty('error', 'Task not found')
      expect(Task.findById).toHaveBeenCalledWith('invalid-id')
    })

    it('should return 500 on database error', async () => {
      vi.mocked(Task.findById).mockRejectedValueOnce(new Error('Database error'))

      const response = await supertest(app).get('/v1.0/task/67f5153450a07804c587f768')

      expect(response.status).toBe(500)
      expect(response.body).toHaveProperty('error', 'Internal Server Error')
      expect(Task.findById).toHaveBeenCalledWith('67f5153450a07804c587f768')
    })
  })
})

