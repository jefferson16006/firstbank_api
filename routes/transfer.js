const express = require('express')
const router = express.Router()
const transfer = require('../controller/transfer')

router.route('/').post(transfer)

module.exports = router