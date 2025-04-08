import express from 'express'
import getTask from '@src/api/v1.0/task/getTask'
import createTask from '@src/api/v1.0/task/createTask'
import updateTask from '@src/api/v1.0/task/updateTask'
import createTaskValidators from '@src/validators/createTaskValidators'
import getTaskValidators from '@src/validators/getTaskValidators'
import fieldValidation from '@src/middleware/fieldValidation'

const taskRouter = express.Router({ mergeParams: true })

taskRouter.get('/:taskId', getTaskValidators, fieldValidation, getTask)
taskRouter.post('/', createTaskValidators, fieldValidation, createTask)
taskRouter.put('/:taskId', updateTask)

export default taskRouter
