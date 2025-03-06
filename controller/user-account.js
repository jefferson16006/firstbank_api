const UserAccount = require('../models/Account')
const { StatusCodes } = require('http-status-codes')
const generateAccoutNumber = require('../generateAccNum')
const jwt = require('jsonwebtoken')
const {
    BadRequestError,
    NotFoundError,
    UnauthenticatedError,
    InternalServerError
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
        throw new InternalServerError('Something went wrong.')
        // res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //     message: "Something went wrong",
        //     error: error.message
        // })
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
    try{
        const lastLogin = await user.updatedAt.toLocaleString()
        await UserAccount.findByIdAndUpdate({ _id: user._id }, { updatedAt: new Date() }, { new: true })
        const accessToken = await user.accessJWT()
        const refreshToken = await user.refreshJWT()
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        res.status(StatusCodes.OK).json({ message: `Welcome, ${ user.name }`, details: {
            accountNum: user.accountNumber,
            balance: user.balance,
            lastLogin: lastLogin
        }, accessToken })
    } catch(error) {
        throw new InternalServerError("Something went wrong.")
        // console.log(error)
    }
}
const refreshToken = async (req, res) => {
    const { refreshToken } = req.cookies
    if(!refreshToken) {
        throw new UnauthenticatedError('Refresh token not available.')
    }
    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRETS)
        const newAccessToken = jwt.sign(
            { userID: payload.userID },
            process.env.ACCESS_TOKEN_SECRETS,
            { expiresIn: '15m' }
        )
        res.status(StatusCodes.OK).json({ newAccessToken })
    } catch(error) {
        throw new InternalServerError("Something went wrong.")
        // console.log(error)
    }
}
const logout = async (req, res) => {
    res.cookie("refreshToken", "", { maxAge: 0 })
    res.status(StatusCodes.OK).json({ message: "Logged out successfully." })
}

module.exports = {
    register,
    login,
    refreshToken,
    logout
}