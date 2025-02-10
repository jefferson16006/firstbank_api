const express = require('express')
const router = express.Router()
const createAccount = require('../controller/account')

router.route('/').post(createAccount)

module.exports = router
