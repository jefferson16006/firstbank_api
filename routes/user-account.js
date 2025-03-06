const express = require('express')
const router = express.Router()
const {
    login,
    register,
    refreshToken,
    logout
} = require('../controller/user-account')

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/refresh-token').get(refreshToken)
router.route('/logout').post(logout)

module.exports = router