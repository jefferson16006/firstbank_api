const express = require('express')
const router = express.Router()
const {
    createAccount,
    getAccount,
    deleteAccount
} = require('../controller/account')

router.route('/').post(createAccount)
router.route('/:id').get(getAccount).delete(deleteAccount)

module.exports = router
