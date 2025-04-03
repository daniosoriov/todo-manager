import express from 'express'

const app = express()
const port = 80

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

