const UserAccount = require('../models/Account')
const Beneficiary = require('../models/beneficiary')
const { StatusCodes } = require('http-status-codes')
const { NotFoundError } = require('../errors')

const beneficiary = async (req, res) => {
    const { id: userID } = req.params
    const user = await UserAccount.findOne({ _id: userID })
    if(!user) {
        throw new NotFoundError('User does not exist.')
    }
    const beneficiaries = await Beneficiary.find({ key: userID })
    res.status(StatusCodes.OK).json({ beneficiaries })
}

module.exports = beneficiary