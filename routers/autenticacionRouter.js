const express = require('express');
const RouterAuth = express.Router()
const authController = require('../controllers/autenticacion')

RouterAuth.route('/login').post(authController.login)
RouterAuth.route('/olvidarcontrasena').post(authController.olvidarcontrasena)
RouterAuth.route('/reiniciarcontrasena/:token').patch(authController.reiniciarcontrasena)

module.exports = RouterAuth;
