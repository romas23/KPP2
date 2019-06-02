const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const postRouter = require('./routes/post')
const vacantionRouter = require('./routes/vacantion')
const keys = require('./keys')

const port = process.env.PORT || 6969
const clientPath = path.join(__dirname, 'client')

mongoose.connect(keys.mongoURI)
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error(err))

const app = express()
app.use(bodyParser.json())
app.use('/api/post', postRouter)
app.use('/vacantion', vacantionRouter)
app.use(express.static(clientPath))

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
