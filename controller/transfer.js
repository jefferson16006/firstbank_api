const UserAccount = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
} = require('../errors')

const transfer = async (req, res) => {
    const { sAccountNum, type, amount, rAccountNum, pin } = req.body
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
    if(type === 'debit' && existingSender.balance > amount) {
        await UserAccount.findOneAndUpdate(
            { accountNumber: sAccountNum },  // Condition to find sender
            { $inc: { balance: -amount } },  // Decrease sender's balance
            { new: true }
        )

        await UserAccount.findOneAndUpdate(
            { accountNumber: rAccountNum },  // Condition to find recipient
            { $inc: { balance: amount } },   // Increase recipient's balance
            { new: true }
        )
    } else {
        throw new BadRequestError("Insufficient balance.")
    }
    // await existingSender.save()
    // await existingRecipient.save()

    // if(type === 'debit' && !existingRecipient.balance <= 0) {
    //     existingRecipient.balance -= amount
    // }
    res.status(StatusCodes.OK).json({
        message: "Transaction successfull.",
        balance: existingSender.balance - amount
    })
}

module.exports = transfer