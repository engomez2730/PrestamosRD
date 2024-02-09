const { Router } = require('express');
const express = require('express');
const userRouter = express.Router()
const usersController = require('../controllers/usersControllers')
const authController = require('../controllers/autenticacion')

userRouter
    .route('/')
    .get(usersController.verUsuarios)
    .post(authController.crearUsuario)
    .delete(usersController.borrarUsuarios)
userRouter
    .route('/:id')
    .get(usersController.verUsuario)
    .patch(usersController.actualizarUsuario)
    .delete(usersController.borrarUsuario)
userRouter
    .route('/login')
    .post(authController.login)

module.exports = userRouter;

