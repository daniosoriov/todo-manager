import express from 'express'
import login from '@src/api/v1.0/auth/login'
import register from '@src/api/v1.0/auth/register'
import refreshToken from '@src/api/v1.0/auth/refreshToken'

import loginValidators from '@src/validators/auth/loginValidators'
import registerValidators from '@src/validators/auth/registerValidators'
import refreshTokenValidators from '@src/validators/auth/refreshTokenValidators'

import authJWT from '@src/middleware/authJWT'
import authRefreshToken from '@src/middleware/authRefreshToken'
import fieldValidation from '@src/middleware/fieldValidation'
import rateLimiter from '@src/middleware/rateLimiter'

const authRouter = express.Router()

authRouter.post('/register', registerValidators, fieldValidation, register)
authRouter.post('/login', loginValidators, fieldValidation, login)
authRouter.post(
    '/refresh-token',
    rateLimiter,
    refreshTokenValidators,
    fieldValidation,
    authJWT,
    authRefreshToken,
    refreshToken,
)

export default authRouter
