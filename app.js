const express = require('express');
const app = express()
const morgan = require('morgan')
const User = require('./models/users')

//Routers
const userRouter = require('./routers/usuariosRoutes')
const prestamoRouter = require('./routers/prestamoRoutes')


if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//Midlewares

app.use(express.json())
app.use(express.static(`${__dirname}/public`))
app.use((req,res,next) =>{
    console.log('Believe in Yourself ❤')
    next()
})
app.use('/api/v1/users',userRouter)
app.use('/api/v1/prestamos',prestamoRouter)


module.exports = app;