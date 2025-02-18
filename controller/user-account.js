const UserAccount = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const generateAccoutNumber = require('../generateAccNum')
const {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError
} = require('../errors')

const register = async (req, res) => {
    try {
        const { name, email, pin, accountNumber, accountType } = req.body
        if(accountNumber) {
            throw new BadRequestError('You cannot provide an account number.')
        }
        const accountNum = await generateAccoutNumber()
        const account = await UserAccount.create({ name, email, pin, accountNumber: accountNum, accountType })
        res.status(StatusCodes.CREATED).json({
            message: "Bank account created successfully",
            details: {
                name: account.name,
                email: account.email,
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
        // console.log(error)
    }
}
const login = async (req, res) => {
    const { email, pin } = req.body
    if(!pin) {
        throw new BadRequestError('Please provide your 4-digit pin.');
    }
    const user = await UserAccount.findOne({ email })
    if(!user) {
        throw new NotFoundError(`Invalid credential: ${ email } cannot be found or is incorrect.`)
    }
    const isPinCorrect = await user.comparePin(pin)
    if(!isPinCorrect) {
        throw new UnauthenticatedError('Invalid credential: Pin is incorrect.')
    }
    const lastLogin = await user.updatedAt.toLocaleString()
    await UserAccount.findByIdAndUpdate({ _id: user._id }, { updatedAt: new Date() }, { new: true })
    res.status(StatusCodes.CREATED).json({ message: `Welcome, ${ user.name }`, details: {
        accountNum: user.accountNumber,
        balance: user.balance,
        lastLogin: lastLogin
    }})
}

module.exports = {
    register,
    login
}