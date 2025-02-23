const express = require('express')
const router = express.Router()
const airtime = require('../controller/airtime')

router.route('/').post(airtime)

module.exports = router