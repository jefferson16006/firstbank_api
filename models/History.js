const mongoose = require('mongoose')

const TransactionHistory = mongoose.Schema({
    key: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true
    },
    date: {
        type: Date
    },
    type: {
        type: String,
        default: "Debit"
    },
    rAccountNum: {
        type: Number
    },
    amount: {
        type: Number
    },
    narration: {
        type: String
    }
})

module.exports = mongoose.model('History', TransactionHistory)