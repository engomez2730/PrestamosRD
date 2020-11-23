const { Router } = require('express');
const express = require('express');
const userRouter = express.Router()
const usersController = require('../controllers/usersControllers')

userRouter
.route('/')
.get(usersController.verUsuarios)

userRouter
.route('/:id')
.get(usersController.verUsuario)
.post(usersController.crearUsuario)
.patch(usersController.actualizarUsuario)
.delete(usersController.borrarUsuario)

module.exports = userRouter;

