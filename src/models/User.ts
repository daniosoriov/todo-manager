import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import getEnvVariable from '@src/utils/getEnvVariable'

const SEVEN_DAYS = 7 * 24 * 60 * 60 // 7 days in seconds
const TWENTY_FOUR_HOURS = 24 * 60 * 60 // 24 hours in seconds

/**
 * Generate a JWT token
 * @param id - User ID
 * @param secret - Secret key
 * @param ttl - Time to live in seconds
 */
const generateToken = (id: string, secret: string, ttl: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign({ _id: id, unique: Date.now() }, secret, { expiresIn: ttl }, (err, token) => {
      if (err) {
        return reject(new Error('Error generating token'))
      }
      if (!token) {
        return reject(new Error('Token generation failed'))
      }
      resolve(token)
    })
  })
}

const userSchema = new Schema(
    {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
      // Declaring methods here directly within the schema options is more convenient
      // because it avoids the need to define a separate TypeScript type for instance methods.
      // Check here: https://mongoosejs.com/docs/guide.html#methods
      methods: {
        /**
         * Compare the password with the hashed password
         * @param candidatePassword
         */
        comparePassword: async function (candidatePassword: string): Promise<boolean> {
          return await bcrypt.compare(candidatePassword, this.password)
        },
        /**
         * Generate a JWT token for the user
         */
        generateAuthToken: async function (): Promise<string> {
          return generateToken(this._id.toString(), getEnvVariable('JWT_SECRET'), TWENTY_FOUR_HOURS)
        },
        /**
         * Generate a refresh token for the user
         */
        generateRefreshToken: async function (): Promise<string> {
          return generateToken(this._id.toString(), getEnvVariable('JWT_REFRESH_SECRET'), SEVEN_DAYS)
        },
      },
    },
)

/**
 * Hash the password before saving the user
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

const User = model('User', userSchema)

export default User
