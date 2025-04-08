import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'

dotenv.config()
import apiRouterV1 from '@src/api/v1.0'
import { connectToDatabase } from '@src/db'
import logRequest from '@src/middleware/logRequest'

const app = express()
const port = 80

app.use(helmet())
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1.0', logRequest, apiRouterV1)

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
