import { Response } from 'express'
import { JWTRequest } from '@src/types/express'
import generateAndStoreTokens from '@src/utils/generateAndStoreTokens'
import User from '@src/models/User'
import Token from '@src/models/Token'

const refreshToken = async (req: JWTRequest, res: Response) => {
  const { token } = req.body
  try {
    const refreshToken = await Token.findOne({ userId: req.user!._id, token })
    if (!refreshToken) {
      res.status(401).json({ message: 'Invalid refresh token' })
      return
    }
    const user = await User.findById(req.user!._id)
    if (!user) {
      res.status(401).json({ message: 'User not found' })
      return
    }
    const { newToken, newRefreshToken } = await generateAndStoreTokens(user)
    res.status(200).json({ token: newToken, refreshToken: newRefreshToken })
  } catch (error) {
    console.error('Error refreshing token:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export default refreshToken
