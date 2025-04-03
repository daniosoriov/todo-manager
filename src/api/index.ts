import express from 'express'
import taskRouter from './task/taskRouter'

const apiRouter = express.Router()

apiRouter.use('/task', taskRouter)

export default apiRouter
