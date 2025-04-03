import mongoose from 'mongoose'

const mongoDBUser = process.env.MONGODB_USER
const mongoDBPassword = process.env.MONGODB_PASSWORD
const mongoDBURI = process.env.MONGODB_URI
const mongoDBCluster = process.env.MONGODB_CLUSTER

if (!mongoDBUser || !mongoDBPassword || !mongoDBURI || !mongoDBCluster) {
  throw new Error('Missing MongoDB connection environment variables')
}

const uri = `mongodb+srv://${mongoDBUser}:${mongoDBPassword}@${mongoDBURI}/?retryWrites=true&w=majority&appName=${mongoDBCluster}`

mongoose.connection.on('connected', () => console.log('[server] Mongoose connected'))
mongoose.connection.on('open', () => console.log('[server] Mongoose open'))
mongoose.connection.on('disconnected', () => console.log('[server] Mongoose disconnected'))
mongoose.connection.on('reconnected', () => console.log('[server] Mongoose reconnected'))
mongoose.connection.on('disconnecting', () => console.log('[server] Mongoose disconnecting'))
mongoose.connection.on('close', () => console.log('[server] Mongoose close'))

async function connectToDatabase() {
  try {
    await mongoose.connect(uri)
    console.log('[server] Successfully connected to MongoDB via Mongoose')
  } catch (error) {
    console.error('[server] Error connecting to MongoDB:', error)
    throw error
  }
}

export { connectToDatabase }
