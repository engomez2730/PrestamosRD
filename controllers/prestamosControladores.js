const prestamoModel = require('../models/prestamos');


exports.verPrestamos = async (req,res) =>{

    console.log(req.query)
    try{
        const queryObj = {... req.query}
        const excluderFields = ['page','limit','sort','fields']
        excluderFields.forEach(el => delete queryObj[el])

/*         document.find({nombre: "Prestamo1",qtl:{totalLend:{$gt:1000}}})
 */
        //Advanced
        let queryStrg = JSON.stringify(queryObj) //Convert query into Json
        queryStrg = queryStrg.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`)
        queryStrg = JSON.parse(queryStrg) //Convert Query in JS in order to get process for mongoose
        let query =  prestamoModel.find(queryStrg)

        if(req.query.sort){
            const sortStr = req.query.sort.split(',').join(' ') 
            query = query.sort(sortStr) //Mongoose
        }
        if(req.query.fields){
            const fieldsStr = req.query.fields.split(',').join(' ')
            query = query.select(fieldsStr)
        }else{
            query = query.select('-__v')
        }

        let prestamo = await query;

        res.status(201).json({
            status:"Sucess",
            cantidadDePrestamos:prestamo.length,
            prestamo
        })
    } catch(err){
        res.status(404).json({
            status:"Failed",
            err
        })
    }
}

exports.createPrestamos = async (req,res) =>{

   try{
    console.log(req.body)

    const prestamo = await prestamoModel.create(req.body);

    res.status(201).json({
        status:"Sucess",
        prestamo
    })
   } catch(err){
    res.status(404).json({
        status:"Failed",
        err
    })
   }



}