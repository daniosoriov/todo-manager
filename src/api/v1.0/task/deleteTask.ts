import { Response } from 'express'
import Task from '@src/models/Task'
import { JWTRequest } from '@src/types/express'

const deleteTask = async (req: JWTRequest, res: Response) => {
  const taskId = req.params.taskId
  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user!._id })
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.status(200).json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default deleteTask
