

//Function that takes another function, and returns an error in case that occurs one
module.exports = catchAsync = fn => {

    return (req, res, next) => {
        fn(req, res, next).catch(err => next(err)) //Returns the error
    }
}
