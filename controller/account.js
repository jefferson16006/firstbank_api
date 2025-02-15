const BankAccount = require('../models/Account')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const generateAccoutNumber = require('../generateAccNum')

const getAccount = async(req, res) => {
    const { params: { id: accountID }, user: { userID } } = req
    const account = await BankAccount.findById({ _id: accountID, createdBy: userID })
    if(!account){
        throw new NotFoundError(`No account with id ${ account } was found.`)
    }
    res.status(StatusCodes.OK).json({
        details: { 
            id: account._id,
            name: req.user.name,
            accountNumber: account.accountNumber,
            accountType: account.accountType,
            balance: account.balance,
            currency: account.currency
        }
    })
}

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

const deleteAccount = async(req, res) => {
    const { params: { id: accountID }, user: { userID } } = req
    const deleteAccount = await BankAccount.findByIdAndDelete({ _id: accountID, createdBy: userID })
    if(!deleteAccount) {
        throw new NotFoundError(`No account with id ${ accountID } was found.`)
    }
    res.status(StatusCodes.OK).json({ message: "Account successfully deleted." })
}

module.exports = {
    createAccount,
    getAccount,
    deleteAccount
}