const express = require('express');
const prestamoControladores = require('../controllers/prestamosControladores');
const { route } = require('./usuariosRoutes');
const router = express.Router()



module.exports = router

router
.get('/',prestamoControladores.verPrestamos)
.post('/',prestamoControladores.createPrestamos);