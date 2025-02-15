const UserAccount = require('./models/Account');

const generateAccoutNumber = async () => {
    let isUnique = false
    let accountNumber
    while (!isUnique) {
        accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString()
        const count = await UserAccount.countDocuments({ accountNumber })
        if (count === 0) {
            isUnique = true
        }
    }
    return accountNumber
}

module.exports = generateAccoutNumber
