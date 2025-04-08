import { Request, Response } from 'express'
import Task from '@src/models/Task'

const createTask = async (req: Request, res: Response) => {
  const task = req.body
  try {
    const newTask = await Task.create(task)
    res.status(201).json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default createTask
