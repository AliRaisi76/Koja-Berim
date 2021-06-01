class ExpressError extends Error {
    constructor(message, statusCode){
        // here we call super function so we could restructure the Error function the way that we want!
        super()
        // in here first message indicates to the message passed in the default Error Function
        this.message = message
        this.statusCode = statusCode

    }
}

module.exports = ExpressError