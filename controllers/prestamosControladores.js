const prestamoModel = require('../models/prestamos');
const usuarioModel = require('../models/users.js')
const ClaseApi = require('../utils/classFeatures')
const { find } = require('../models/prestamos');
const Funciones = require('../utils/funciones')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const Email = require('../utils/email')

exports.verPrestamos = catchAsync(async (req, res, next) => {
    const ClaseApiObject = new ClaseApi(prestamoModel.find(), req.query).filter().sort().pagination()
    let prestamo = await ClaseApiObject.query;
    res.status(201).json({
        status: "Sucess",
        cantidadDePrestamos: prestamo.length,
        prestamo
    })

})

exports.createPrestamos = catchAsync(async (req, res, next) => {
    const prestamo = await prestamoModel.create(req.body);
    const mensaje = `Ya Su prestamo fue creado con exito, si quiere ver los de talles vaya
    a esta url: ${req.protocol}://${req.get('host')}/api/v1/users/auth/login`

    try {
        await Email({
            email: req.body.usuarioEmail,
            subject: "Prestamo Confirmado con Exito",
            message: mensaje
        })
        const usuario = await usuarioModel.findOne({ email: prestamo.usuarioEmail })
        if (usuario) {
            await prestamoModel.update({ usuarioEmail: usuario.email }, { $push: { usuario: usuario._id } })
        }
        res.status(201).json({
            status: "Success",
            prestamo
        })
    } catch (err) {
        next(new AppError('Sucedio algo enviando el correo', 404))
    }
})
//Actualizar Pago
exports.actualizarPagoPrestamo = catchAsync(async (req, res, next) => {
    const prestamoActualizado = await prestamoModel.findOne({ _id: req.params.id })
    const nuevoMesCuenta = prestamoActualizado.mounthsLefts - 1
    const date = new Date()
    const nuevoMes = Funciones.aumentarMes(prestamoActualizado)
    const nuevaCantidadDinero = prestamoActualizado.totalLendRemaining - prestamoActualizado.monthlyPayment
    console.log(nuevaCantidadDinero)
    let status = ''
    if (prestamoActualizado.dayOfPayment > date) {
        status = 'pendiente'
    }
    if (prestamoActualizado.dayOfPayment < date) {
        status = 'atrasado'
    }
    if (nuevoMesCuenta <= 0) {
        status = 'pagado'
    }
    console.log(nuevoMesCuenta)
    const prestamoActualizadoNuevo = await prestamoModel.findByIdAndUpdate(req.params.id, {
        statusPayment: status,
        dayOfPayment: nuevoMes,
        mounthsLefts: nuevoMesCuenta > 0 ? nuevoMesCuenta : 0,
        totalLendRemaining: nuevaCantidadDinero > 0 ? nuevaCantidadDinero : 0,
    }, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        status: "Success",
        prestamoActualizadoNuevo
    })
})

exports.verPrestamo = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const prestamo1 = await prestamoModel.findById(id)
    if (!prestamo1) {
        return next(new AppError(`No hay prestamos con ese Id`, 404))
    }
    res.status(201).json({
        status: "Success",
        prestamo1
    })
})

exports.borrarPrestamo = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    await prestamoModel.findByIdAndDelete(id)
    res.status(201).json({
        status: "Success",
        message: "Eliminado con Exito"
    })

})

exports.actualizarPrestamo = catchAsync(async (req, res, next) => {

    const id = req.params.id;
    const body = req.body
    const prestamo = await prestamoModel.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        status: "Success",
        prestamo
    })
})

exports.borarTodosPrestamos = catchAsync(async (req, res, next) => {

    await prestamoModel.deleteMany({})
    res.status(201).json({
        status: "Success",
        mensaje: "Borrados todos los prestamos"
    })

})

exports.estadisticasPrestamo = catchAsync(async (req, res) => {

    const stats = await prestamoModel.aggregate([
        {
            $match: {
                statusPayment: { $in: ['pendiente', 'atrasados', 'pagado'] }
            }
        },
        {
            $group: {
                _id: "$statusPayment",
                total: { $sum: 1 },
                avg: { $avg: "$totalLend" },
                maxValue: { $max: "$totalLend" },
                minValue: { $min: "$totalLend" }
            }
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])
    res.status(201).json({
        status: 'Success',
        stats
    })

})