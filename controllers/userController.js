
const formularioLogin = (req, res) =>{
    res.render('auth/login',{
        autenticado : true
    })
};

const formularioRegistrer = (req, res) =>{
    res.render('auth/register',{
        
    })
};

const formulariopassRecovery = (req, res) =>{
    res.render('auth/passworRecovery',{
   
    })
};

export {formularioLogin}
export {formularioRegistrer}
export {formulariopassRecovery}