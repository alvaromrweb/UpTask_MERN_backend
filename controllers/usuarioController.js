import Usuario from '../models/Usuario.js'
import generarId from '../helpers/generarId.js'
import generarJWT from '../helpers/generarJWT.js'
import { emailRegistro, emailPassword } from '../helpers/email.js'

const registrar = async (req, res) => {
    // Comprobar si existe el usuario
    const {email} = req.body
    const existeUsuario = await Usuario.findOne({ email })

    if(existeUsuario) {
        const error = new Error('Usuario ya registrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const usuario = new Usuario(req.body)
        usuario.token = generarId()
        const usuarioAlmacenado = await usuario.save()

        emailRegistro(usuarioAlmacenado)

        res.json({msg: 'Usuario creado correctamente, revisa tu email para confirmar tu cuenta'})
    } catch (error) {
        console.log(error)
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    // Comprobar si existe el usuario
    const usuario = await Usuario.findOne({ email })
    if(!usuario) {
        const error = new Error('El usuario no existe')
        return res.status(404).json({ msg: error.message })
    }
    
    // Comprobar si el usuario esta confirmado
    if(!usuario.confirmado) {
        const error = new Error('Tu cuenta no está confirmada')
        return res.status(403).json({ msg: error.message })
    }

    // Comprobar si la contraseña es  correcta
    if(await usuario.comprobarPassword(password)) {
        res.status(200).json({
            _id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            token: generarJWT(usuario.id)
        })
    } else {
        const error = new Error('La contraseña no es correcta')
        return res.status(400).json({ msg: error.message })
    }
}

const confirmar = async (req, res) => {
    const {token} = req.params

    const usuario = await Usuario.findOne({ token })
    if(!usuario) {
        const error = new Error('Token no válido')
        return res.status(400).json({ msg: error.message })
    } 

    try {
        usuario.confirmado = true
        usuario.token = ""
        const usuarioActualizado = await usuario.save()
        res.json({msg: 'Usuario confirmado correctamente'})
    } catch (error) {
        console.log(error)
    }
    
}

const olvidePassword = async (req, res) => {
    const {email} = req.body

    const usuario = await Usuario.findOne({ email })
    if(!usuario) {
        const error = new Error('El email no es correcto')
        return res.status(400).json({ msg: error.message })
    }

    try {
        usuario.token = generarId()
        await usuario.save()

        emailPassword(usuario)
        res.json({ msg: 'Hemos enviado un email con las instrucciones' })
    } catch (error) {
        console.log(error)
    }

}

const comprobarToken = async (req, res) => {
    const {token} = req.params

    const usuario = await Usuario.findOne({ token })
    if(!usuario) {
        const error = new Error('Token no válido')
        return res.status(400).json({ msg: error.message })
    } else {
        res.json({msg: 'Token válido'})

    }
}

const nuevoPassword = async (req, res) => {
    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({ token })
    if(!usuario) {
        const error = new Error('Token no válido')
        return res.status(400).json({ msg: error.message })
    } else {
        try {
            usuario.password = password
            usuario.token = ''
            await usuario.save()
            res.json({msg: 'Contraseña cambiada'})
            
        } catch (error) {
            console.log(error)
        }

    }
}

const perfil = async (req, res) => {
    
    res.json(req.usuario)
}

export {
    registrar,
    login,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil
}