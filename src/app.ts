import express from 'express'
import helmet from 'helmet'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import YAML from 'yaml'
import swaggerUi from 'swagger-ui-express'

dotenv.config()
import apiRouterV1 from '@src/api/v1.0'
import { connectToDatabase } from '@src/db'
import logRequest from '@src/middleware/logRequest'

const app = express()
const port = parseInt(process.env.PORT || '3000', 10)

app.use(helmet())
app.disable('x-powered-by')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

try {
  const filePath = path.resolve(__dirname, './docs/v1.0/openapi.yaml')
  const file = fs.readFileSync(filePath, 'utf8')
  const swaggerDocument = YAML.parse(file)

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  console.log(`[server] OpenAPI UI available at http://localhost:${port}/api-docs`)
} catch (error) {
  console.error('Error loading OpenAPI document for v1.0:', error)
}

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
