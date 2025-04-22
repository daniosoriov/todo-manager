import jwt from 'jsonwebtoken'
import User from '@src/models/User'

const createTestUserAndToken = async (email: string, password: string, jwtSecret: string) => {
  const user = await User.create({ email, password })
  const userId = user._id.toString()
  const token = jwt.sign({ _id: userId }, jwtSecret, { expiresIn: '1h' })
  return { userId, token }
}

export default createTestUserAndToken
