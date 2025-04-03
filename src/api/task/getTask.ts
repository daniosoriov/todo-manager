import { Request, Response } from 'express'
import Task from '@src/models/Task'

const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id
    const task = await Task.findById(taskId)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
    }
    res.status(200).json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default getTask
