import express from 'express'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import supertest from 'supertest'
import updateTask from '@src/api/v1.0/task/updateTask'
import Task from '@src/models/Task'

const app = express()
app.use(express.json())
const path = '/v1.0/task/:taskId'
app.put(path, updateTask)

vi.mock('@src/models/Task', () => ({
  default: {
    findByIdAndUpdate: vi.fn(),
  },
}))

const taskId = '67f5153450a07804c587f768'
const payload = {
  title: 'Updated task',
  description: 'Updated task description',
  status: 'completed',
  dueDate: '2026-03-23T00:00:00.000Z',
}

describe('Update Task', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Successful Cases', () => {
    it('should update a task successfully', async () => {
      vi.mocked(Task.findByIdAndUpdate).mockResolvedValueOnce({ ...payload, _id: taskId } as any)
      const response = await supertest(app).put(path.replace(':taskId', taskId)).send(payload)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Task updated successfully' })
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskId, payload, { new: true })
    })
  })

  describe('Failure Cases', () => {
    it('should return 404 when the task is not found', async () => {
      vi.mocked(Task.findByIdAndUpdate).mockResolvedValueOnce(null)
      const response = await supertest(app).put(path.replace(':taskId', taskId)).send(payload)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskId, payload, { new: true })
    })

    it('should return 400 for no updates', async () => {
      const response = await supertest(app).put(path.replace(':taskId', taskId)).send({})
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ error: 'No updates provided' })
      expect(Task.findByIdAndUpdate).not.toHaveBeenCalled()
    })

    it('should return 400 for invalid taskId format', async () => {
      const response = await supertest(app).put(path.replace(':taskId', 'invalid-id')).send(payload)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ error: 'Task not found' })
    })

    it('should return 500 on database error', async () => {
      vi.mocked(Task.findByIdAndUpdate).mockRejectedValueOnce(new Error('Database error'))
      const response = await supertest(app).put(path.replace(':taskId', taskId)).send(payload)
      expect(response.status).toBe(500)
      expect(response.body).toEqual({ error: 'Internal Server Error' })
      expect(Task.findByIdAndUpdate).toHaveBeenCalledWith(taskId, payload, { new: true })
    })
  })
})
