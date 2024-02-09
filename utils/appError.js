//Creating Error handling class

class AppError extends Error {
    constructor(message, statusCode) {
        super(message) //Calling the ERROR constructor 
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'Error';
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor) //Getting the line where occurs the error
    }

}

module.exports = AppError