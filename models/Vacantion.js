const mongoose = require('mongoose')
const Schema = mongoose.Schema

const vacantionSchema = new Schema({
  personId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  beginDate: {
    type: Date,
    required: true
  }
})

module.exports = mongoose.model('vacantions', vacantionSchema)
