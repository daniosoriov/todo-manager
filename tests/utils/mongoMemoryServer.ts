// tests/utils/mongoMemoryServer.ts

// Inspiration from: https://github.com/enochchau/vitest-mongodb/blob/main/vitest-mongodb/src/index.ts

import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

export const connectInMemoryDB = async () => {
  try {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
  } catch (error) {
    console.error('Error connecting to in-memory MongoDB:', error)
    throw error
  }
}

export const disconnectInMemoryDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
  }
  if (mongoServer) {
    await mongoServer.stop()
  }
}
