import { Request } from 'express'
import { DecodedToken } from '@src/types/interfaces'

export type JWTRequest = Request & { user?: DecodedToken }

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken
    }
  }
}
