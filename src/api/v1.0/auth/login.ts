import { NextFunction, Request, Response } from 'express'
import User from '@src/models/User'

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return next(new Error('Invalid credentials'))
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return next(new Error('Invalid credentials'))
    }
    const token = await user.generateAuthToken()
    res.status(200).json({ token })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default login
