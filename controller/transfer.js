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
    const { sAccountNum, amount, rAccountNum, pin, narration } = req.body
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
    const amountNum = Number(amount); // Ensure it's a number

    if (!amountNum || amountNum <= 0) {
        throw new BadRequestError("Please provide a valid transfer amount.");
    }

    if (existingSender.balance > amountNum) {
        await UserAccount.findOneAndUpdate(
            { accountNumber: sAccountNum },
            { $inc: { balance: -amountNum } },
            { new: true }
        );
        await UserAccount.findOneAndUpdate(
            { accountNumber: rAccountNum },
            { $inc: { balance: amountNum } },
            { new: true }
        );
    } else {
        throw new BadRequestError("Insufficient balance.");
    }
    
    await History.create({
        key: existingSender._id,
        date: new Date().toLocaleString(),
        rAccountNum: rAccountNum,
        amount: amount,
        narration: narration ? narration : ""
    })
    // if(beneficiary === 'yes') {
    //     await Beneficiary.create({
    //         key: existingSender._id,
    //         name: existingRecipient.name,
    //         rAccountNum: rAccountNum
    //     })
    // }
    const updatedSender = await UserAccount.findOne({ accountNumber: sAccountNum });

    res.status(StatusCodes.OK).json({
        message: "Transaction successful.",
        balance: updatedSender.balance
    });
    
}

module.exports = transfer