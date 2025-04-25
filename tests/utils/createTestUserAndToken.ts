import User from '@src/models/User'
import generateAndStoreTokens from '@src/utils/generateAndStoreTokens'

const createTestUserAndToken = async (email: string, password: string) => {
  const user = await User.create({ email, password })
  const userId = user._id.toString()
  const { newToken, newRefreshToken } = await generateAndStoreTokens(user)
  return { userId, token: newToken, refreshToken: newRefreshToken }
}

export default createTestUserAndToken
