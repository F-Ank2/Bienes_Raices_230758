import { check, validationResult } from "express-validator";
import { generateId } from "../helpers/tokens.js";
import { registerEmail } from "../helpers/emails.js";
import User from "../models/User.js";

const formLogin = (req, res) => {
    res.render('auth/login', {
        page: "Iniciar sesión"
    });
};

const formCreateAccount = (req, res) => {
    res.render('auth/createAccount', {
        page: "Crear una cuenta",
        csrfToken: req.csrfToken(),
    });
};

const create = async (req, res) => {
    // Validación de campos
    await check('name').notEmpty().withMessage('El nombre no debe ir vacío, intente de nuevo.').run(req);
    await check('email').isEmail().withMessage('Por favor, ingrese un correo electrónico válido.').run(req);
    await check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres.').run(req);
    await check('repeat-password').custom((value, { req }) => value === req.body.password).withMessage('Las contraseñas no coinciden').run(req);

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
            }
        });
    }

    // Extraer los datos del formulario
    const { name, email, password } = req.body;

    // Verificar si el usuario ya existe
    const userExist = await User.findOne({ where: { email } });
    if (userExist) {
        return res.render('auth/createAccount', {
            page: "Crear una cuenta",
            errors: [{ msg: `El usuario ${req.body.name} ya existe` }],
            csrfToken: req.csrfToken(),
            user: {
                name: req.body.name,
                email: req.body.email,
            }
        });
    }

    // Almacenar un nuevo usuario
    const user = await User.create({
        name,
        email,
        password,
        token: generateId()
    });

    // Enviar correo de confirmación
    registerEmail({
        name: user.name,
        email: user.email,
        token: user.token
    });

    // Mostrar mensaje de confirmación
    res.render('template/message', {
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
        user.confirmAccount = true;
        await user.save(); // Guardar los cambios en la base de datos

        // Mostrar mensaje de confirmación
        res.render('auth/confirm_Account', {
            page: 'Cuenta Confirmada',
            msg: 'La cuenta se confirmó correctamente. Ya puedes loguearte.',
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

const formPasswordRecovery = (req, res) => {
    res.render('auth/passwordRecovery', {
        page: "Recupera tu contraseña",
        csrfToken: req.csrfToken(),
    });
};

export {
    formLogin,
    formCreateAccount,
    formPasswordRecovery,
    confirmAccount,
    create
};
