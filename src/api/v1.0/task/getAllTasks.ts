import { NextFunction, Response } from 'express'
import Task from '@src/models/Task'
import { JWTRequest } from '@src/types/express'

const getAllTasks = async (req: JWTRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({ userId: req.user!._id })
    if (!tasks) {
      res.status(404).json({ error: 'No tasks found' })
      return
    }
    res.status(200).json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default getAllTasks
