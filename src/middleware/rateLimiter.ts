import { rateLimit } from 'express-rate-limit'

export const RATE_LIMITER_LIMIT = 10

/**
 * Rate limiter middleware to limit the number of requests from a single IP address.
 */
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: RATE_LIMITER_LIMIT,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: 'draft-8',
  legacyHeaders: false,
})

export default rateLimiter
