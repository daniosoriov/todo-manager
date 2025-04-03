import express from 'express'
import apiRouter from './api'

const app = express()
const port = 80

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1.0', apiRouter)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

