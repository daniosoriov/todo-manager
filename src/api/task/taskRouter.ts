import express from 'express'
import getTask from './getTask'

const taskRouter = express.Router({ mergeParams: true })

taskRouter.get('/:id', getTask)

export default taskRouter
