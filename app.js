const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const authRouter = require('./routes/user-account')
const accountRouter = require('./routes/account')
const transactionRouter = require('./routes/transaction')
const tranferRouter = require('./routes/transfer')
const airtimeRouter = require('./routes/airtime')
const beneficiaryRouter = require('./routes/beneficiary')
const authenticationMiddleware = require('./middleware/auth')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
require('dotenv').config()
require('express-async-errors')

// middleware to parse JSON data
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Banking API')
})

// routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/history', transactionRouter)
app.use('/api/v1/transfer', tranferRouter)
app.use('/api/v1/airtime', airtimeRouter)
app.use('/api/v1/beneficiary', beneficiaryRouter)
app.use('/api/v1/account', authenticationMiddleware, accountRouter)

// middleware
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 5000
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()