const express = require('express');
const prestamoControladores = require('../controllers/prestamosControladores');
const { route } = require('./usuariosRoutes');
const router = express.Router()
const authController = require('../controllers/autenticacion')


router.route('/')
    .get(prestamoControladores.verPrestamos)
    .post(authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.createPrestamos)
    .delete(authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.borarTodosPrestamos)
router.get('/stats', authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.estadisticasPrestamo)
router.route('/:id')
    .get(authController.protegerRutas, authController.verRol('Admin', 'Usuario'), prestamoControladores.verPrestamo)
    .delete(authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.borrarPrestamo)
    .patch(authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.actualizarPrestamo)
router.patch('/:id/actualizarPago', authController.protegerRutas, authController.verRol('Admin'), prestamoControladores.actualizarPagoPrestamo)

module.exports = router
