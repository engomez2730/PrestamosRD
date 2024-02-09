const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/appError')

exports.verInicio = catchAsync(async (req, res, next) => {
    res.status(201).render('index')
})

exports.login = catchAsync(async (req, res, next) => {
    res.status(201).render('login')
})

exports.crearusuario = catchAsync(async (req, res, next) => {
    res.status(201).render('crearusuario')
})