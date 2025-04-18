import { Schema, model } from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'

dotenv.config()

const { JWT_SECRET } = process.env

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
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
          return new Promise((resolve, reject) => {
            jwt.sign({ _id: this._id }, JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
              if (err) {
                return reject(new Error('Error generating token'))
              }
              if (!token) {
                return reject(new Error('Token generation failed'))
              }
              resolve(token)
            })
          })
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
