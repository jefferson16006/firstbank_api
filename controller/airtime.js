const UserAccount = require('../models/Account')
const {
    NotFoundError,
    BadRequestError,
    UnauthenticatedError
} = require('../errors')
const { StatusCodes } = require('http-status-codes')

const airtime = async (req, res) => {
    const { accountNum, amount, pin } = req.body
    const user = await UserAccount.findOne({ accountNumber: accountNum })
    if(!user) {
        throw new NotFoundError('Account number is invalid.')
    }
    const isPinCorrect = await user.comparePin(pin)
    if(!isPinCorrect) {
        throw new UnauthenticatedError('Invalid credential: Pin is incorrect.')
    }
    if(user.balance > amount) {
        await UserAccount.findOneAndUpdate(
            { accountNumber: accountNum },
            { $inc: { balance: -amount } },
            { new: true }
        )
    } else throw new BadRequestError("Insufficient balance.")
    res.status(StatusCodes.OK).json({
        message: "Recharge successfull.",
        balance: user.balance - amount
    })
}

module.exports = airtime