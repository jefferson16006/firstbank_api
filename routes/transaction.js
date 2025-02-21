const express = require('express')
const router = express.Router()
const history = require('../controller/transaction')

router.route('/:id').get(history)

module.exports = router