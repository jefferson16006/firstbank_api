const express = require('express')
const router = express.Router()
const transact = require('../controller/transaction')

router.route('/').get(transact)

module.exports = router