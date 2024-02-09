const express = require('express')
const viewsController = require('../controllers/viewsControladores')
const Router = express.Router()

Router.get('/', viewsController.verInicio)
Router.get('/login', viewsController.login)
Router.get('/crearusuario', viewsController.crearusuario)


module.exports = Router