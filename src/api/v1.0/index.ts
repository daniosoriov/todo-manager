import express from 'express'
import taskRouter from '@src/api/v1.0/task/taskRouter'

const apiRouterV1 = express.Router()

apiRouterV1.use('/task', taskRouter)

export default apiRouterV1
