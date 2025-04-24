import { Request, Response } from 'express'
import generateAndStoreTokens from '@src/utils/generateAndStoreTokens'
import User from '@src/models/User'

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email: email })
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' })
      return
    }
    const { newToken, newRefreshToken } = await generateAndStoreTokens(user)
    res.status(200).json({ token: newToken, refreshToken: newRefreshToken })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default login
