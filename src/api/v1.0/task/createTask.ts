import { Response } from 'express'
import Task from '@src/models/Task'
import { JWTRequest } from '@src/types/express'

const createTask = async (req: JWTRequest, res: Response) => {
  const task = req.body
  try {
    const newTask = await Task.create({ ...task, userId: req.user!._id })
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default createTask
