const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({path: './config.env'})

const app = require('./app')

const db = process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD)

mongoose.connect(db,
    {
     useNewUrlParser: true,
     useUnifiedTopology: true
    }
).then(con =>{
    console.log('Subio la data base 🔥')
})

const port = process.env.port
app.listen(port, function(){
    console.log('Server Ready 💪🔥')
})

