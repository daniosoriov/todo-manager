import { Request, Response } from 'express'
import User from '@src/models/User'

const register = async (req: Request, res: Response) => {
  const payload = req.body
  try {
    const newUser = await User.create(payload)
    res.status(201).json({ 'message': 'User registered successfully' })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default register
