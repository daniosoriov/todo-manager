import { NextFunction, Request, Response } from 'express'
import { vi } from 'vitest'

const taskId = '67f5153450a07804c587f768'

const req = {
  params: { taskId },
} as Partial<Request>

const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
} as Partial<Response>

const next = vi.fn() as NextFunction

export {
  req,
  res,
  next,
  taskId,
}
