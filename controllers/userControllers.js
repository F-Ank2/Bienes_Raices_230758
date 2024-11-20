import { check, validationResult } from "express-validator";


import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";
import User from "../models/User.js";

const formLogin = (req, res) =>{
    res.render('auth/login',{
        page : "Iniciar sesion"
    })
};

const formCreateAccount = (req, res) =>{
    
    res.render('auth/createAccount',{
        page : "Crear una cuenta",
        csrfToken: req.csrfToken()
    })
};

const create = async(req, res) => {
    //validacion de contraseña
    await check('name').notEmpty().withMessage('El nombre no debe ir vacio, intente de nuevo.').run(req)
    await check('email').isEmail().withMessage('Por favor, ingrese un correo electronico valido.').run(req)
    await check('password').isLength({min: 6}).withMessage('La contraseña debe tener al menos 6 caracteres.').run(req)
    await check('repeat-password').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req)

    let result = validationResult(req)

    //verificar si un resultado esta vacio

    if (!result.isEmpty()){
        return res.render('auth/createAccount',{
            page: "crear una cuenta",
            errors: result.array(),
            user:{
                name: req.body.name,
                email: req.body.email,
            }

        })
    } 

    //Extraer los datos
    const {name, email, password} = req.body

    // verificar si el usuario no esta duplicado
    const userExist = await User.findOne({where: {email}})
    if(userExist){
        return res.render('auth/createAccount',{
            page: "crear una cuenta",
            errors: [{msg: 'El usuario ya esta registrado'}],
            user:{
                name: req.body.name,
                email: req.body.email,
            }

        })
    }

    //Almacenar un usuario
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    })

    //enviar correo de confirmacion
    registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    })

    /*console.log(userExist)
    return;*/ 

    //Mostrar mensaje de confirmacion
    res.render('template/message', {
        page: 'Cuenta creada',
        msg: `Se a enviado un email de confirmación a: ${email}, por favor, ingrese al siguiente enlace`
    })
}

//Funcion que comprueba una cuenta
const confirmAccount= async (req, res) => {
    const {token} = req.params;
    
    //Verificar si el token es valido

    const user = await User.findOne({where: {token}})
    
    if(!user){
        return res.render('auth/confirm_Account',{
            page: 'error al confirmar tu cuenta',
            msg: '¡Ups!, algo a salido mal, intentalo de nuevo',
            error: true
        })
    }

    //confrimar la cuenta
    user.token = null
    user.confirmAccount = true
    await user.save()

    res.render('auth/confirm_Account', {
        page: 'Cuenta Confirmada',
        mesage: 'La cuenta se confirmo correctamente',
    }) 
}

const formPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery',{
        page : "Recupera tu contraseña"
    })
};

export {
    formLogin,
    formCreateAccount,
    formPasswordRecovery,
    confirmAccount,
    create
}