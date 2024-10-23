import generalRoutes from './routes/generalRoutes.js'
import userRoutes from './routes/userRoutes.js'
// ? Ejemplo de activacion de HOT RELOAD
//console.log("Hola desde NodeJS, esto esta en hot reload")

//const express = require(`express`) // ? Usando CommonJS
// ? Importar la libreria para crear un servidor web - CommonJS / ECMA Script 6
// ? Instanciar nuestra aplicacion web

import express from 'express'

const app = express()


const port = 3000

app.listen(port, () =>
    console.log(`La aplicacion ha iniciado en el puerto: ${port}`))
// ? Routing - Enrutacion para peticiones

app.use("/",generalRoutes);
app.use("/usuario/", userRoutes);
