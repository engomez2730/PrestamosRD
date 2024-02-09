const e = require("express")
const User = require("../models/users")
const catchAsync = require("../utils/catchAsync")

exports.verUsuarios = catchAsync(async (req, res) => {

    //Sample Filtering
    const queryObj = { ...req.query }
    const excluderFields = ['page', 'limit', 'sort', 'fields']
    excluderFields.forEach(el => delete queryObj[el])

    //Advance Filtering
    const query = User.find(queryObj)
    const users = await query;
    res.status(201).json({
        status: 'Success',
        cantidadUsuarios: users.length,
        users
    })
})

//VerUsuario

exports.verUsuario = catchAsync(async (req, res) => {

    const id = req.params.id;
    console.log(req.params.id)
    const user = await User.findById(id)
    res.status(201).json({
        status: 'Success',
        user
    })

})

//actualizarUsuario

exports.actualizarUsuario = catchAsync(async (req, res) => {
    const id = req.params.id;
    const userUpdated = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(201).json({
        status: 'Sucess',
        mensaje: ' Usuario Actualizado',
        userUpdated
    })

})

//Borrar usuario 
exports.borrarUsuario = catchAsync(async (req, res) => {

    const id = req.params.id;
    const user = await User.findByIdAndDelete(req.params.id)
    res.status(201).json({
        status: "Sucess",
        mensaje: "Usuario Eliminado"
    })
})

//Borrar todos los Usuarios 
exports.borrarUsuarios = catchAsync(async (req, res, next) => {
    await User.deleteMany()
    res.status(201).json({
        status: "Sucess",
        mensaje: "Usuarios Eliminado"
    })
}
)
