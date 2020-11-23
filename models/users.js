const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"Un usuario debe tener un nombre"]
    },
    email:{
        type:String,
        required:[true,"Un usuario debe tener un correo"],
        unique: true
    },
    phone:{
        type:Number,
        required:[true,'Un Usuario debe tener un Telefono']
    },
    address:{
        type:String,
        required:[true,'Un usuario deber tene una dirrecion']
    },
    createdAt:{
        type:Date,
        default: Date.now()
    },
    state:{
        type:Boolean,
        default:true
    },
    password:{
        type:String,
        required:[true,'Un usuario debe tener una contrasena']
    },
    confirmPassword:{
        type:String,
        required:[true,'Debe confirmar su contrasena']
    }

})

const User = mongoose.model('User',userSchema);

module.exports = User;