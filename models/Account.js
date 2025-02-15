const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AccountSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: [true, 'Please provide an email.'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            "Please provide a valid email."
        ],
        unique: true
    },
    pin: {
        type: String,
        required: [true, 'Please provide a 4-digit pin.'],
        minlength: 4,
        maxlength: 4
    },
    accountNumber: {
        type: Number,
        unique: true,
        required: true
    },
    accountType: {
        type: String,
        enum: {
            values: ['Savings', 'Current'],
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
    // lastLogin: {
    //     type: Date,
    //     default: Date.now
    // }
    // createdBy: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'User',
    //     required: [true, "Please provide a user."]
    // }
}, { timestamps: true })


AccountSchema.pre('save', async function(next) {
    if (!this.isModified('pin')) return next()
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
    next()
})
AccountSchema.methods.comparePin = async function (candidatePin) {
    return await bcrypt.compare(candidatePin, this.pin)
}

module.exports = mongoose.model('UserAccount', AccountSchema)