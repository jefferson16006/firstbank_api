const UserAccount = require('../models/Account')
const History = require('../models/History')
const Beneficiary = require('../models/beneficiary')
const { StatusCodes } = require('http-status-codes')
const {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
} = require('../errors')

const transfer = async (req, res) => {
    const { sAccountNum, amount, rAccountNum, pin, narration, beneficiary } = req.body
    if(!sAccountNum || !pin) {
        throw new BadRequestError('Please provide your account number and 4-digit pin.')
    }
    const existingSender = await UserAccount.findOne({ accountNumber: sAccountNum })
    if(!existingSender) {
        throw new NotFoundError(`Invalid account number: no user with ${ sAccountNum } exists`)
    }
    const isPinCorrect = await existingSender.comparePin(pin)
    if(!isPinCorrect) {
        throw new UnauthenticatedError('Invalid credential: Pin is incorrect.')
    }
    const existingRecipient = await UserAccount.findOne({ accountNumber: rAccountNum })
    if(!existingRecipient) {
        throw new NotFoundError(`Invalid account number: no user with ${ rAccountNum } exists`)
    }
    if(existingSender.balance > amount) {
        await UserAccount.findOneAndUpdate(
            { accountNumber: sAccountNum },
            { $inc: { balance: -amount } },
            { new: true }
        )
        await UserAccount.findOneAndUpdate(
            { accountNumber: rAccountNum },
            { $inc: { balance: amount } },
            { new: true }
        )
    } else throw new BadRequestError("Insufficient balance.")
    
    await History.create({
        key: existingSender._id,
        date: new Date().toLocaleString(),
        rAccountNum: rAccountNum,
        amount: amount,
        narration: narration ? narration : ""
    })
    if(beneficiary === 'yes') {
        await Beneficiary.create({
            key: existingSender._id,
            name: existingRecipient.name,
            rAccountNum: rAccountNum
        })
    }
    res.status(StatusCodes.OK).json({
        message: "Transaction successfull.",
        balance: existingSender.balance - amount
    })
}

module.exports = transfer