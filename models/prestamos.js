const mongoose = require('mongoose');
const prestamosControladores = require('../controllers/prestamosControladores')
const usuarioModel = require('./users')
const Funciones = require('../utils/funciones')
const User = require('./users')
const validator = require('validator')

const prestamosSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Un Prestamo debe tener un nombre"],
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    monthlyPayment: {
        type: Number,
    },
    mounthDuration: {
        type: Number,
        required: [true, "Un Prestamo debe tener un pago mensual"],
        max: [36, "El prestamo no puede durar mas de 3 años"],
        min: [1, "El prestamo no puede durar meons de 1 mes"]
    },
    mounthsLefts: {
        type: Number
    },
    interestRate: {
        type: Number,
        required: [true, 'Un Prestamo debe tener un insteres'],
        default: 8,
        max: [50, "El prestamo no puede tener unos intereses mayor al 50%"],
        min: [1, "El prestamo no puede tener unos intereses menor al 1%"],
    },
    totalLend: {
        type: Number,
        required: [true, "Un prestamo debe tener una cantidad Prestada"],
        max: [100000000, "El prestamo no puede tener una cantidad mayor a los 100000000"],
        min: [1, "El prestamo no puede tener una cantidad menor al 1"],

    },
    totalLendRemaining: {
        type: Number,
    },
    totalInterest: Number,
    status: {
        type: Boolean,
        default: true
    },
    total: Number,
    dayOfPayment: {
        type: Date,
        required: true
    },
    statusPayment: {
        type: String,
        required: true,
        default: "pendiente",
        enum: {
            values: ["pagado", "atrasado", "pendiente"],
            mensaje: "Tiene que tener une stado"
        }

    },
    usuarioEmail: {
        type: String,
        required: true,
/*         validate: validator.isEMail
 */    },
    usuario: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],


}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

//Advancing an month, after create an Prestamo
prestamosSchema.pre('save', function (next) {
    this.dayOfPayment = Funciones.aumentarMes(this)
    next()
})
//Calculating Interest, TotalLEnd and Total
prestamosSchema.pre('save', function (next) {
    const intereses = this.interestRate / 100
    this.totalInterest = this.totalLend * intereses
    this.total = this.totalLend + this.totalInterest
    this.monthlyPayment = Math.round(this.total / this.mounthDuration)
    next()
})
//Validating Payment Status
prestamosSchema.pre('save', function (next) {
    const date = new Date()
    if (this.dayOfPayment < date /* && this.dayOfPayment > this.createdAt */) {
        this.statusPayment = "atrasados"
    }
    next()
})
//Validating MounthLeft
prestamosSchema.pre('save', function (next) {
    this.mounthsLefts = this.mounthDuration
    this.totalLendRemaining = this.total
    next()
})
//Getting the user info (Embbeding)
/* prestamosSchema.pre('save', async function (next) {
    const usuarioFinal = await User.findById(this.usuario)
    this.usuario = usuarioFinal
    next()
}) */

//Getting the user info (Reffering)
prestamosSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'usuario',
        select: "-__v -rol -state -createdAt"
    })
    next()
})



const prestamoModel = mongoose.model('Prestamo', prestamosSchema);

module.exports = prestamoModel;