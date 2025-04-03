import { MongoClient, ServerApiVersion } from 'mongodb'

const mongoDBUser = process.env.MONGODB_USER
const mongoDBPassword = process.env.MONGODB_PASSWORD
const mongoDBURI = process.env.MONGODB_URI
const mongoDBCluster = process.env.MONGODB_CLUSTER

if (!mongoDBUser || !mongoDBPassword || !mongoDBURI || !mongoDBCluster) {
  throw new Error('Missing MongoDB connection environment variables')
}

const uri = `mongodb+srv://${mongoDBUser}:${mongoDBPassword}@${mongoDBURI}/?retryWrites=true&w=majority&appName=${mongoDBCluster}`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

async function connectToDatabase() {
  try {
    await client.connect()
    await client.db('admin').command({ ping: 1 })
    console.log('[server] Successfully connected to MongoDB')
  } finally {
    await client.close()
  }
}

export { client, connectToDatabase }
