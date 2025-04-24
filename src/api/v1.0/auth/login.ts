import { Request, Response } from 'express'
import User from '@src/models/User'
import Token from '@src/models/Token'

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
    const token = await user.generateAuthToken()
    const refreshToken = await user.generateRefreshToken()
    Token.findOneAndReplace({ userId: user._id }, { token: refreshToken }, { upsert: true })
    res.status(200).json({ token, refreshToken })
  } catch (error) {
    console.error('Error logging in:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

export default login
