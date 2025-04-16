import express from 'express'
import getAllTasks from '@src/api/v1.0/task/getAllTasks'
import getTask from '@src/api/v1.0/task/getTask'
import createTask from '@src/api/v1.0/task/createTask'
import updateTask from '@src/api/v1.0/task/updateTask'
import deleteTask from '@src/api/v1.0/task/deleteTask'
import createTaskValidators from '@src/validators/createTaskValidators'
import getTaskValidators from '@src/validators/getTaskValidators'
import updateTaskValidators from '@src/validators/updateTaskValidators'
import deleteTaskValidators from '@src/validators/deleteTaskValidators'
import fieldValidation from '@src/middleware/fieldValidation'
import validFieldsOnly from '@src/middleware/validFieldsOnly'

const taskRouter = express.Router()

taskRouter.get('/', getAllTasks)
taskRouter.get('/:taskId', getTaskValidators, fieldValidation, getTask)
taskRouter.post('/', validFieldsOnly, createTaskValidators, fieldValidation, createTask)
taskRouter.put('/:taskId', validFieldsOnly, updateTaskValidators, fieldValidation, updateTask)
taskRouter.delete('/:taskId', deleteTaskValidators, fieldValidation, deleteTask)

export default taskRouter
