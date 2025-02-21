const UserAccount = require('../models/Account')
const History = require('../models/History')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const history = async (req, res) => {
    const { id: userID } = req.params
    const user = await UserAccount.findOne({ _id: userID })
    if(!user) {
        throw new NotFoundError('User does not exist.')
    }
    const userHistory = await History.find({ key: userID })
    res.status(StatusCodes.OK).json({ userHistory })
}

module.exports = history