const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const AirtimeSchema = mongoose.Schema({
    biller: {
        type: String,
        enum: {
            values: ['MTN', 'Glomobile', '9Mobile', 'Airtel'],
            message: 'Provider is not available.'
        },
        required: true
    },
    phoneNum: {
        type: Number,
        unique: true,
        required: true
    },
    accountNum: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    pin: {
        type: String,
        required: [true, 'Please provide a 4-digit pin.'],
        minlength: 4,
        maxlength: 4
    }
})
AirtimeSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
})


module.exports = mongoose.model('Airtime', AirtimeSchema)