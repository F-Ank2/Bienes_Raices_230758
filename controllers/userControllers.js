const formLogin = (req, res) =>{
    res.render('auth/login',{
        page : "Iniciar sesion"
    })
};

const formCreateAccount = (req, res) =>{
    res.render('auth/createAccount',{
        page : "Crear una cuenta"
    })
};

const formPasswordRecovery = (req, res) =>{
    res.render('auth/passwordRecovery',{
        page : "Recupera tu contraseña"
    })
};

export {
    formLogin,
    formCreateAccount,
    formPasswordRecovery
}