const BankAccount = require('../models/Account')
const { BadRequestError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const generateAccoutNumber = require('../generateAccNum')

const createAccount = async (req, res) => {
    try {
        const { accountNumber, accountType } = req.body
        const { userID } = req.user
        if(accountNumber) {
            throw new BadRequestError('You cannot provide an account number.')
        }
        const accountNum = await generateAccoutNumber()
        // req.body.createdBy = req.user.userID
        const account = await BankAccount.create({ accountNumber: accountNum, accountType, createdBy: userID })
        res.status(StatusCodes.CREATED).json({
            message: "Bank account created successfully",
            details: {
                id: account._id,
                name: req.user.name,
                accountNumber: account.accountNumber,
                accountType: account.accountType,
                balance: account.balance,
                currency: account.currency
            }
        })
    } catch(error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

module.exports = createAccount