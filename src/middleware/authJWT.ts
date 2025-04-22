import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import getEnvVariable from '@src/utils/getEnvVariable'
import { DecodedToken } from '@src/types/interfaces'
import { JWTRequest } from '@src/types/express'

const authJWT = (req: JWTRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '')
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return next(new Error('Unauthorized'))
  }

  try {
    const JWT_SECRET = getEnvVariable('JWT_SECRET')
    req.user = jwt.verify(token, JWT_SECRET) as DecodedToken
    next()
  } catch (error) {
    console.error('Invalid token:', error)
    res.status(401).json({ error: 'Unauthorized' })
    next(new Error('Unauthorized'))
  }
}

export default authJWT
