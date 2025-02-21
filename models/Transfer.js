const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const TrasnferSchema = mongoose.Schema({
    sAccountNum: {
        type: Number,
        unique: true,
        required: true
    },
    // type: {
    //     type: String,
    //     enum: {
    //         values: ['debit', 'credit'],
    //         message: 'Transaction type not supported.'
    //     },
    //     required: true
    // },
    amount: {
        type: Number,
        required: [true, 'Please provide an amount for transaction.']
    },
    rAccountNum: {
        type: Number,
        required: [true, 'Please provide an account number.']
    },
    pin: {
        type: String,
        required: [true, 'Please provide a 4-digit pin.'],
        minlength: 4,
        maxlength: 4
    },
    narration: {
        type: String
    }
})
TrasnferSchema.pre('save', async function() {
    const salt = await bcrypt.genSalt(10)
    this.pin = await bcrypt.hash(this.pin, salt)
})
TrasnferSchema.methods.comparePin = async function(candidatePin) {
    return await bcrypt.compare(candidatePin, this.pin)
}

module.exports = mongoose.model('Transfer', TrasnferSchema)