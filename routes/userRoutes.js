import express from 'express';
import {formLogin, formCreateAccount, formPasswordRecovery} from '../controllers/userControllers.js'

const router = express.Router();

//EndPoints - son las rutas para acceder a las secciones o funciones de nuestra aplicacion web
//2 componentes de una peticion, ruta, funcion, callback
// ":" en una ruta definen de manera posicional los parametros de entrada

//GET - 
router.get("/FindById/:Id" ,function (request, response){
    response.send(`Se esta solicitando buscar al usuario con ID: ${request.params.Id}`);
})

//POST - 
    router.post("/newUser/:name/:email/:password", function (req, res){
        res.send(` se ha solicitado la creacion de un nuevo usuario de nombre: ${req.params.name},
            asociado al correo electronico ${req.params.email} y con la contraseña ${req.params.password}`);
    })
//PUT - Se utiliza para la actualizacion global de todo el objeto, en este caso la informacion del usuario
    router.put("/replaceUser/:name/:email/:password", function (taco, quesadilla) {
        quesadilla.send(`Se esta solicitando el remplazo de toda la informacion del usuario: ${taco.params.name},
            con el correo electronico ${taco.params.email} y la contraseña ${taco.params.password}`);
    })
//PATCH - Se utiliza para la actualizacion de ciertas propiedades del objeto
    router.patch("/updatePassword/:email/:newPassword/:passwordConfirm", function (a, b){
        const {email, newPassword, passwordConfirm} = a.params //desestructuracion de un objeto
        if (newPassword === passwordConfirm){
            b.send(`Se esta solicitando la actalizacion de la contraseña del usuario del usuario con el correo: ${email},
                se aceptan los cambios ya que la contraseña y la confirmacion es la misma`);
        }else{
            b.send(`Se esta solicitando la actalizacion de la contraseña del usuario del usuario con el correo: ${email},
                con la nueva contraseña ${newPassword}, pero se rechaza el cambio dado que su nueva contraseña y su confirmacion no coinciden`);
        }
    })
//DELETE
    router.delete("/deleteUser/:name", function (pko, mota){
        mota.send(`se esta solicitando eliminar el usuario ${pko.params.name}`);
        });


router.get("/login", formLogin)
router.get("/register", formCreateAccount)
router.get("/passwordRecovery", formPasswordRecovery)
export default router;