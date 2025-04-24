import User from '@src/models/User'
import Token from '@src/models/Token'

/**
 * Generate and store new tokens for the user
 * @param user The user instance
 */
const generateAndStoreTokens = async (user: InstanceType<typeof User>) => {
  const newToken = await user.generateAuthToken()
  const newRefreshToken = await user.generateRefreshToken()

  await Token.findOneAndUpdate(
      { userId: user._id },
      { $set: { token: newRefreshToken } },
      { upsert: true, new: true },
  )

  return { newToken, newRefreshToken }
}

export default generateAndStoreTokens
