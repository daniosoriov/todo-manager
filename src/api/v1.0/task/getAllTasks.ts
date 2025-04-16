import { NextFunction, Request, Response } from 'express'
import Task from '@src/models/Task'

const getAllTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await Task.find({})
    if (!tasks) {
      res.status(404).json({ error: 'No tasks found' })
      return next(new Error())
    }
    res.status(200).json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default getAllTasks
