import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()
import apiRouter from './api'
import { connectToDatabase } from './db'
import logRequest from '@src/middleware/logRequest'

const app = express()
const port = 80

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1.0', logRequest, apiRouter)

connectToDatabase().then(() => {
  const server = app.listen(port, '0.0.0.0', (error) => {
    if (error) {
      throw error
    }
    console.log(`[server] Listening on ${JSON.stringify(server.address())}`)
  })
}).catch(error => {
  console.error('[server] Error connecting to the database:', error)
  process.exit(1)
})
