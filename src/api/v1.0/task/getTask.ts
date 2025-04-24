import { Response } from 'express'
import Task from '@src/models/Task'
import { JWTRequest } from '@src/types/express'

const getTask = async (req: JWTRequest, res: Response) => {
  try {
    const taskId = req.params.taskId
    const task = await Task.findOne({ _id: taskId, userId: req.user!._id })
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.status(200).json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default getTask
