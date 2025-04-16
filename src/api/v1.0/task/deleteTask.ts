import { NextFunction, Request, Response } from 'express'
import Task from '@src/models/Task'

const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  const taskId = req.params.taskId
  try {
    const task = await Task.findByIdAndDelete(taskId)
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return next(new Error())
    }
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default deleteTask
