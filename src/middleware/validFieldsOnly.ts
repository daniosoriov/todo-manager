import { Request, Response, NextFunction } from 'express'
import Task from '@src/models/Task'

const validFieldsOnly = (req: Request, res: Response, next: NextFunction) => {
  const validFields = Object.keys(Task.schema.obj)
  const bodyFields = Object.keys(req.body)

  const invalidFields = bodyFields.filter((field) => !validFields.includes(field))
  if (invalidFields.length > 0) {
    res.status(400).json({
      error: 'Invalid fields in the request',
      invalidFields,
    })
    throw new Error('Invalid fields in the request')
  }
  next()
}

export default validFieldsOnly
