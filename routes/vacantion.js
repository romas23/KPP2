const express = require('express')
const router = express.Router()
const Vacantion = require('../models/Vacantion')

// http://localhost:5000/api/vacantion (GET)
router.get('/', async (req, res) => {
  const vacantions = await Vacantion.find({})

  res.status(200).json(vacantions)
})
// ... (POST)
router.post('/', async (req, res) => {

  const vacantionData = {
    personId: req.body.personId,
    amount: req.body.amount,
    beginDate: req.body.beginDate
  }

  const vacantion = new Vacantion(vacantionData)

  await vacantion.save()
  res.status(201).json(vacantion)
})
// .../(:id) (DELETE)
router.delete('/:id', async (req, res) => {
  await Vacantion.deleteOne({_id: req.params.id})
  res.status(200).json({
    message: 'Deleted'
  })
})

module.exports = router
