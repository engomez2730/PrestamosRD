const express = require('express');
const app = express()
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const User = require('./models/users')
const hpp = require('hpp')
const AppError = require('./utils/appError')
const ErrorControladores = require('./controllers/errorControladores')
const cons = require('consolidate');
const path = require('path')
const axios = require('axios');

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//Routers
const userRouter = require('./routers/usuariosRoutes')
const prestamoRouter = require('./routers/prestamoRoutes')
const authRouter = require('./routers/autenticacionRouter')
const viewRouter = require('./routers/viewsRouter')

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Demasiados intentos, intente mas tarde"
})
console.log(process.env.NODE_ENV)

//Midlewares
app.use(function (req, res, next) {
    res.setHeader("Content-Security-Policy", "script-src 'self' https://cdnjs.cloudflare.com/ajax/libs/axios/0.21.1/axios.min.js");
    return next();
});
app.use(
    helmet({
        contentSecurityPolicy: false,
    })
);
app.use('/api', limiter)
app.use(express.json({ limit: '10kb' }))
app.use(mongoSanitize())
app.use(xss())
app.use(hpp())
app.use(express.static(`${__dirname}/public`))
app.use((req, res, next) => {
    console.log('Believe in Yourself ❤')
    /*    console.log(req.headers) */

    next()
})
app.use('/api/v1/users', userRouter)
app.use('/api/v1/prestamos', prestamoRouter)
app.use('/api/v1/auth', authRouter)
app.use('/', viewRouter)

//Midlewares that listen to all types of request
app.all('*', (req, res, next) => {
    next(new AppError(`No pudo encontrar la URL ${req.originalUrl} en el Servidor`, 408))
})
//Handler error midleare
app.use(ErrorControladores)

module.exports = app;