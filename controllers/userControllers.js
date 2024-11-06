const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        page : "Iniciar sesion"
    })
};

export {formularioLogin}