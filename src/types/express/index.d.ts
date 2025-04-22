import { DecodedToken } from '@src/types/interfaces'

declare global {
  namespace Express {
    interface Request {
      user?: DecodedToken
    }
  }
}
