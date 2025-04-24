import { Response } from 'express'
import Task from '@src/models/Task'
import { JWTRequest } from '@src/types/express'

const updateTask = async (req: JWTRequest, res: Response) => {
  const taskId = req.params.taskId
  const taskUpdates = req.body
  if (!taskUpdates || Object.keys(taskUpdates).length === 0) {
    res.status(400).json({ error: 'No updates provided' })
    return
  }

  try {
    const task = await Task.findOneAndUpdate(
        { _id: taskId, userId: req.user!._id },
        taskUpdates,
        { new: true },
    )
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
      return
    }
    res.status(200).json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default updateTask
