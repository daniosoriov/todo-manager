import { Request, Response, NextFunction } from 'express'
import Task from '@src/models/Task'

const updateTaskFieldValidation = (req: Request, res: Response, next: NextFunction) => {
  const validFields = Object.keys(Task.schema.obj)
  const updateFields = Object.keys(req.body)

  const invalidFields = updateFields.filter((field) => !validFields.includes(field))
  if (invalidFields.length > 0) {
    res.status(400).json({
      error: 'Invalid fields in update request',
      invalidFields,
    })
    throw new Error('No updates provided')
  }
  next()
}

export default updateTaskFieldValidation
