import express from "express"
const router = express.Router()

import { registrar, login, confirmar, olvidePassword, comprobarToken, nuevoPassword, perfil } from "../controllers/usuarioController.js"
import checkAuth from "../middleware/checkAuth.js"
// Autenticacion, registro y confirmacion de usuarios

router.post('/', registrar) // Crear un nuevo usuario
router.post('/login', login) // login
router.get('/confirmar/:token', confirmar) // confirmar
router.post('/olvide-password', olvidePassword) // olvidar cntraseña
router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword)
router.get('/perfil', checkAuth, perfil)


export default router