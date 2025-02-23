const express = require('express')
const router = express.Router()
const beneficiary = require('../controller/beneficiary')

router.route('/:id').get(beneficiary)

module.exports = router