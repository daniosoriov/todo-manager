import express from 'express'
import dotenv from 'dotenv'

dotenv.config()
import apiRouter from './api'
import { connectToDatabase } from './db'

const app = express()
const port = 80

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1.0', apiRouter)

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`[server] Server is running on port ${port}`)
  })
}).catch(error => {
  console.error('[server] Error connecting to the database:', error)
  process.exit(1)
})
