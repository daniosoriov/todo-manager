import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import getEnvVariable from '@src/utils/getEnvVariable'
import { DecodedToken } from '@src/types/interfaces'
import { JWTRequest } from '@src/types/express'

const authRefreshToken = (req: JWTRequest, res: Response, next: NextFunction) => {
  const { token } = req.body
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }

  try {
    const JWT_REFRESH_SECRET = getEnvVariable('JWT_REFRESH_SECRET')
    req.user = jwt.verify(token, JWT_REFRESH_SECRET) as DecodedToken
    next()
  } catch (error) {
    console.error('Invalid refresh token:', error)
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
}

export default authRefreshToken
