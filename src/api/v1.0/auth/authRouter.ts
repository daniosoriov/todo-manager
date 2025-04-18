import express from 'express'
import login from '@src/api/v1.0/auth/login'
import register from '@src/api/v1.0/auth/register'

const authRouter = express.Router()

authRouter.post('/register', register)
authRouter.post('/login', login)

export default authRouter
