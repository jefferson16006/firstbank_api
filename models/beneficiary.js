const mongoose = require('mongoose')

const BeneficiarySchema = mongoose.Schema({
    key: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserAccount",
        required: true
    },
    name: {
        type: String,
    },
    rAccountNum: {
        type: Number,
    }
})

module.exports = mongoose.model('Beneficiary', BeneficiarySchema)