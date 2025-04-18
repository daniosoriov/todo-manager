import express from 'express'
import authRouter from '@src/api/v1.0/auth/authRouter'
import taskRouter from '@src/api/v1.0/task/taskRouter'

const apiRouterV1 = express.Router()

apiRouterV1.use('/auth', authRouter)
apiRouterV1.use('/task', taskRouter)

export default apiRouterV1
