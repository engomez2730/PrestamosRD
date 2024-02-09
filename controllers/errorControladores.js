const { eventNames } = require("../app")
const AppError = require("../utils/appError")

const sendErrorDev = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    })
}

const handleCastErrorDB = err => {
    const message = `Invalido id ${err.path} : ${err.value}`
    return new AppError(message, 400)
}


const sendErrorProd = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    })
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || "Error"

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(res, err)
    } else {
        let error = { ...err }
        if (error.kind === 'ObjectId') error = handleCastErrorDB(error)
        sendErrorProd(res, error)
    }
}

