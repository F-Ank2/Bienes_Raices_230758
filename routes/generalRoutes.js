import express from 'express'

const router = express.Router()

router.get("/", function(req, res){
    res.send("Hola desde la web en NodeJS")
})

router.get("/quienSoy", function(req, res){
    res.json({
        "nombre" : "Francisco Garcia Garcia",
        "carrera" : "TI DSM",
        "grado" : "4",
        "grupo" : "A"
    })
})
export default router;