import { Request, Response } from 'express'
import Task from '@src/models/Task'

const updateTask = async (req: Request, res: Response) => {
  const taskId = req.params.taskId
  const taskUpdates = req.body
  if (!taskUpdates || Object.keys(taskUpdates).length === 0) {
    res.status(400).json({ error: 'No updates provided' })
  }

  try {
    const task = await Task.findByIdAndUpdate(taskId, taskUpdates, { new: true })
    if (!task) {
      res.status(404).json({ error: 'Task not found' })
    }
    res.status(200).json({ message: 'Task updated successfully' })
  } catch (error) {
    console.error('Error updating task:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default updateTask
