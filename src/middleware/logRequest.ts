import { Request, Response, NextFunction } from 'express'

const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[log] - [${new Date().toISOString()}] - ${req.method} ${req.url}`)
  next()
}

export default logRequest
