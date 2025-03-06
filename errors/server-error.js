const customAPIError = require('./custom-error')
const { StatusCodes } = require('http-status-codes')

class BadRequest extends customAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
    }
}

module.exports = BadRequest