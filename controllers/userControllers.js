import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import { registerEmail, emailChangePassword } from "../helpers/emails.js";
import User from "../models/User.js";

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: "Iniciar sesión",
        csrfToken: req.csrfToken(),
    });
};

const formCreateAccount = (req, res) => {
    res.render('auth/createAccount', {
        page: "Crear una cuenta",
        csrfToken: req.csrfToken(),
    });
};

const formPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: "Recupera tu contraseña",
        csrfToken: req.csrfToken(),
    });
};

const create = async (req, res) => {
    // Validación de campos
    await check('name').notEmpty().withMessage('El nombre no puede ir vacío <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 162px; display: inline-block;" />').run(req);
    await check('email').isEmail().withMessage('Por favor, ingrese un correo electrónico válido. <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 10px; display: inline-block;" />').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres. <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 12px; display: inline-block;" />').run(req);
    await check('repeat-password').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 143px; display: inline-block;" />').run(req);
    await check('birthDate')
        .notEmpty().withMessage('La fecha de nacimiento no puede ir vacía <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 10px; display: inline-block;" />')
        .custom((value) => {
            const hoy = new Date();
            const fechaNacimiento = new Date(value);
            const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                return edad - 1 >= 18;
            }
            return edad >= 18;
        }).withMessage('Debes ser mayor de edad para registrarte <img src="/assets/error.png" alt="Error" style="width: 20px; height: 20px; vertical-align: middle; margin-left: 10px; display: inline-block;" />').run(req);
    let result = validationResult(req);

    // Verificar si hay errores de validación
    if (!result.isEmpty()) {
        return res.render('auth/createAccount', {
            page: "Crear una cuenta",
            csrfToken: req.csrfToken(),
            errors: result.array(),
            user: {
                name: req.body.name,
                email: req.body.email,
                birthDate: req.body.birthDate,
            }
        });
    }

    // Extraer los datos del formulario
    const { name, email, password, birthDate } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
        return res.render('auth/createAccount', {
            page: "Error al intentar crear la Cuenta de Usuario",
            errors: [{ msg: `El usuario asociado al correo ${req.body.email} ya existe` }],
            csrfToken: req.csrfToken(),
            user: {
                 name,
                 email,
                 birthDate
            }
        });
    }

    // Almacenar un nuevo usuario
    const user = await User.create({
        name,
        email,
        password,
        birthDate,
        token: generateId()
    });

    // Enviar correo de confirmación
    registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    });

    // Mostrar mensaje de confirmación
    res.render('templates/message', {
        page: 'Cuenta creada',
        msg: `Se ha enviado un email de confirmación a: ${email}, por favor, ingrese al siguiente enlace`
    });
};

const confirmAccount = async (req, res) => {
    const { token } = req.params;

    try {
        // Verificar si el token es válido
        const user = await User.findOne({ where: { token } });

        if (!user) {
            return res.render('auth/confirm_Account', {
                page: 'Error al confirmar tu cuenta',
                csrfToken: req.csrfToken(),
                msg: '¡Ups!, algo ha salido mal, inténtalo de nuevo',
                error: true
            });
        }

        // Confirmar la cuenta: eliminar el token y marcar la cuenta como confirmada
        user.token = null;
        user.confirm = 1;
        await user.save(); // Guardar los cambios en la base de datos

        // Mostrar mensaje de confirmación
        res.render('auth/confirm_Account', {
            page: 'Cuenta Confirmada',
            msg: `La cuenta se confirmó correctamente. Ya puedes loguearte.`,
            error: false
        });
    } catch (error) {
        console.error(error);
        res.render('auth/confirm_Account', {
            page: 'Error al confirmar tu cuenta',
            csrfToken: req.csrfToken(),
            msg: 'Hubo un problema al confirmar tu cuenta. Inténtalo nuevamente.',
            error: true
        });
    }
};

const passwordReset = async(request, response) =>{

    //console.log("Validando los datos para la recuperación de la contraseña")
    //Validación de los campos que se reciben del formulario
    //Validación de Frontend
    await check('email').notEmpty().withMessage("El correo electrónico es un campo obligatorio.").isEmail().withMessage("El correo electrónico no tiene el formato de: usuario@dominio.extesion").run(request)
    let result = validationResult(request)
    
    //Verificamos si hay errores de validacion
    if(!result.isEmpty())
    {
        console.log("Hay errores")
        return response.render("auth/passwordRecovery", {
            page: 'Error al intentar resetear la contraseña',
            errors: result.array(),
            csrfToken: request.csrfToken()
        })
    }
    
    //Desestructurar los parametros del request
    const {email:email} = request.body

    //Validacion de BACKEND
    //Verificar que el usuario no existe previamente en la bd
    const userExist = await User.findOne({ where: { email, confirm:1}})

    if(!userExist)
    { 
        
        return response.render("auth/passwordRecovery", {
        page: 'Error, no existe una cuenta autentificada asociada al correo electrónico ingresado.',
        csrfToken: request.csrfToken(),
        errors: [{msg: `Por favor revisa los datos e intentalo de nuevo` }],
        user: {
            email:email
        }
    })
    }
        
        console.log("El usuario si existe en la bd")
        //Registramos los datos en la base de datos.
        userExist.password="";
        userExist.token=  generateId();
        userExist.save();
      

    //Enviar el correo de confirmación
    emailChangePassword({
        name: userExist.name,
        email: userExist.email,
        token: userExist.token   
    })

    response.render('templates/message', {
        csrfToken: request.csrfToken(),
        page: 'Solicitud de actualización de contraseña aceptada',
        msg: `Se ha enviado un correo a ${email} para la recuperacion de la contraseña`
    })


}

const verifyTokenPasswordChange =async(request, response)=>{

    const {token} = request.params;
    const userTokenOwner = await User.findOne({where :{token}})

    if(!userTokenOwner)
        { 
            response.render('templates/message', {
                csrfToken: request.csrfToken(),
                page: 'Error',
                msg: 'El token ha expirado o no existe.'
            })
        }

     
   
    response.render('auth/reset-password', {
        csrfToken: request.csrfToken(),
        page: 'Restablece tu password',
        msg: 'Por favor ingresa tu nueva contraseña'
    })
}

const updatePassword = async (request, response) => {
    const { token } = request.params;

    // Validar campos de contraseñas
    await check('new_password')
        .notEmpty()
        .withMessage("La contraseña es un campo obligatorio.")
        .isLength({ min: 6 })
        .withMessage("La contraseña debe ser de al menos 6 caracteres.")
        .run(request);

    await check("confirm_new_password")
        .equals(request.body.new_password)
        .withMessage("La contraseña y su confirmación deben coincidir")
        .run(request);

    const result = validationResult(request);

    if (!result.isEmpty()) {
        return response.render("auth/reset-password", {
            page: 'Error al intentar crear la Cuenta de Usuario',
            errors: result.array(),
            csrfToken: request.csrfToken(),
            token: token
        });
    }

    try {
        // Actualizar en BD el pass 
        const userTokenOwner = await User.findOne({ where: { token } });

        if (!userTokenOwner) {
            return response.render('auth/reset-password', {
                page: 'Error al actualizar la contraseña',
                errors: [{ msg: 'Usuario no encontrado o token inválido.' }],
                csrfToken: request.csrfToken(),
                token: token
            });
        }

        userTokenOwner.password = request.body.new_password;
        userTokenOwner.token = null;
        await userTokenOwner.save(); 

        // Renderizar la respuesta
        response.render('auth/confirm_Account', {
            page: 'Cambio de contraseña cambiada con exito',
            msg: 'Tu contraseña ha sido confirmada de manera exitosa.',
            error: false
        });

    } catch (error) {
        console.error('Error updating password:', error);
        response.status(500).render('auth/reset-password', {
            page: 'Error al actualizar la contraseña',
            errors: [{ msg: 'Ocurrió un error inesperado. Por favor intenta nuevamente.' }],
            csrfToken: request.csrfToken(),
            token: token
        });
    }
};


export {
    formLogin,
    formCreateAccount,
    formPasswordRecovery,
    confirmAccount,
    create,
    passwordReset,
    verifyTokenPasswordChange,
    updatePassword
}
