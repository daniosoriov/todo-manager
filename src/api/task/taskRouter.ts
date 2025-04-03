import express from 'express'
import getTask from './getTask'
import createTask from './createTask'

const taskRouter = express.Router({ mergeParams: true })

taskRouter.get('/:id', getTask)
taskRouter.post('/', createTask)

export default taskRouter
