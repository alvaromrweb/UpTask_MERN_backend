import nodemailer from 'nodemailer'

export const emailRegistro = async (usuario) => {

    console.log(usuario)
    var transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      let info = await transport.sendMail({
        from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>', // sender address
        to: usuario.email, // list of receivers
        subject: "UpTask - Confirma tu cuenta", // Subject line
        text: "Confirma tu cuenta de UpTask", // plain text body
        html: `
        <p>Hola ${usuario.nombre}, confirma tu cuenta en UpTask</p>

        <p>Tu cuenta está casi lista, solo debes confirmarla haciendo click en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/confirmar-cuenta/${usuario.token}">Confirmar cuenta</a></p>

        <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
        `
      });
      console.log("Message sent: %s", info.messageId);
}

export const emailPassword = async (usuario) => {

    console.log(usuario)
    var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

      let info = await transport.sendMail({
        from: '"UpTask - Administrador de proyectos" <cuentas@uptask.com>', // sender address
        to: usuario.email, // list of receivers
        subject: "UpTask - Restablece tu contraseña", // Subject line
        text: "Restablece tu contraseña", // plain text body
        html: `
        <p>Hola ${usuario.nombre}, restablece tu contraseña</p>

        <p>Puedes cambiar tu contraseña haciendo click en el siguiente enlace: <a href="${process.env.FRONTEND_URL}/nuevo-password/${usuario.token}">Establecer nueva contraseña</a></p>

        <p>Si no has pedido un reset de tu contraseña, puedes ignorar este mensaje</p>
        `
      });
      console.log("Message sent: %s", info.messageId);
}