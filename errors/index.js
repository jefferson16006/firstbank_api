const customAPIError = require('./custom-error')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found-error')
const InternalServerError = require('./server-error')

module.exports = {
    customAPIError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
    InternalServerError
}