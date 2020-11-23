const e = require("express")
const User = require("../models/users")

exports.verUsuarios = async (req,res) =>{
    try{

        //Sample Filtering
        const queryObj = {... req.query}
        const excluderFields = ['page','limit','sort','fields']
        excluderFields.forEach(el => delete queryObj[el])

        //Advance Filtering

    
     const query =  User.find(queryObj)

     const users = await query;
    res.status(201).json({
            status:'Success',
            cantidadUsuarios:users.length,
            users
    })
    }catch(err){
        res.status(201).json({
            status:"Failed",
            er
        })
    }
}

//VerUsuario

exports.verUsuario = async (req,res) =>{
    try{
        const id = req.params.id;
        console.log(req.params.id)
        const user = await User.findById(id)
        res.status(201).json({
                status:'Success',
                user
        })   
    }catch(err){
        res.status(404).json({
            status:'Failed',
            err
        })
    }
}

//CrearUsuario

exports.crearUsuario = async (req,res) =>{

    try{
        const user =  await User.create(req.body)
        res.status(201).json({
            status:"Sucess",
            data:{
                user
            }
        })
    }catch(err){
        res.status(404).json({
            status:"Failed",
            error:{
                err
            }
        })
    }
}

//actualizarUsuario

exports.actualizarUsuario = async (req,res) =>{
    
   try{
    const id = req.params.id;

    const userUpdated = await User.findByIdAndUpdate(id,req.body,{
        new:true,
        runValidators:true
    })

    res.status(201).json({
        status: 'Sucess',
        mensaje:' Usuario Actualizado',
        userUpdated
    })
    
   }catch(err){
       res.status(404).json({
           status:'Failed',
           err
       })
   }
}

//Borrar usuario 

exports.borrarUsuario = async (req,res) =>{

    
    try{
        const id = req.params.id;

        const user = await User.findByIdAndDelete(req.params.id)

        res.status(201).json({
            status:"Sucess",
            mensaje: "Usuario Eliminado"
        })


    }catch(err){
        res.status(404).json({
            status:"Failed",
            err
        })
    }

    
}

