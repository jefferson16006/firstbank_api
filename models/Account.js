const mongoose = require('mongoose')
const { BadRequestError } = require('../errors')

const AccountSchema = mongoose.Schema({
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    accountType: {
        type: String,
        enum: {
            values: ['Savings', 'Checking'],
            message: 'Account type is not supported.'
        },
        required: true
    },
    balance: {
        type: Number,
        default: 0,
        required: true
    },
    currency: {
        type: String,
        default: 'NGN'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, "Please provide a user."]
    }
}, { timestamps: true })



module.exports = mongoose.model('BankAccount', AccountSchema)