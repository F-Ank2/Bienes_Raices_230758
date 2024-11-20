import nodemailer from 'nodemailer'
const registerEmail = async (data) => {

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    
    const {email, name, token} = data
    
    //enviar el email
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Hola!, Confirma tu Cuente en BienesRacies.com',
        text: '¡Gracias por subscribirte a la comunidad de BienesRacices!',
        html: `<p>¡Hola ${name}!, comprueba tu cuenta en BienesRacices.com </p>

              <p>Tu cuenta ya esta lista, solo haz click en el enlace: 
              <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm_Account/${token}">Confirmar cuenta</a></p>

              <p>¿No era para ti?, haz caso omiso al correo</p>
              `  
    })
}


export {
    registerEmail
}