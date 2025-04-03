import { Request, Response } from 'express'

const getTask = async (req: Request, res: Response) => {
  try {
    const taskId = req.params.id
    const task = { id: taskId, name: 'Sample Task' }
    res.status(200).json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default getTask
