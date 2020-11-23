const mongoose = require('mongoose');
const prestamosControladores = require('../controllers/prestamosControladores')


const prestamosSchema = new mongoose.Schema({
    
    name:{
        type:String,
        required:[true,"Un Prestamo debe tener un nombre"]
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    monthlyPayment:{
        type:Number,
        required:[true,"Un Prestamo debe tener un pago mensual"]
    },
    interests:{
        type:Number,
        required:[true,'Un Prestamo debe tener un insteres'],
        default: 8
    },
    totalLend:{
        type:Number,
        required:[true,"Un prestamo debe tener una cantidad Prestada"]
    },
    status:{
        type:Boolean,
        default:true
    }

})

const prestamoModel = mongoose.model('Prestamo',prestamosSchema);

module.exports = prestamoModel;