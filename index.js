import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
import db from './config/db.js'
import express from 'express'
// ? Ejemplo de activacion de HOT RELOAD
//console.log("Hola desde NodeJS, esto esta en hot reload")
//const express = require(`express`) // ? Usando CommonJS
// ? Importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
// ? Instanciar nuestra aplicacion web

const app = express()

//conexion a la base de datos
try{
    await db.authenticate();
    console.log('conexión correcta a la base de datos')
}catch (error){
    console.log(error);
}

//Habilitar PUG
app.set('view engine', 'pug')
app.set('views','./Views')

//Carpeta publica
app.use(express.static('public'))

//definir el puerto
const port = 3000 

app.listen(port, () =>
    console.log(`La aplicacion ha iniciado en el puerto: ${port}`))
// ? Routing - Enrutacion para peticiones
app.get('/', function(req, res){
    res.send('Hola desde la web en NodeJS')
})

app.get('/hola', function(req, res){
    res.json({msg: 'Hola desde la web en NodeJS'})
})

//Routing
app.use("/",generalRoutes);
app.use("/auth/", userRoutes);