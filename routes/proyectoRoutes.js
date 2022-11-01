import express from "express"

import { addColaborador, buscarColaborador, deleteColaborador, deleteProyecto, editProyecto, getProyecto, getProyectos, getTareas, nuevoProyecto } from "../controllers/proyectoController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()
router.route('/')
    .get(checkAuth, getProyectos)
    .post(checkAuth, nuevoProyecto)

router.route('/:id')
    .get(checkAuth, getProyecto)
    .put(checkAuth, editProyecto)
    .delete(checkAuth, deleteProyecto)

router.get('/tareas/:id', checkAuth, getTareas)

router.post('/colaboradores', checkAuth, buscarColaborador)
router.post('/colaboradores/:id', checkAuth, addColaborador)
router.delete('/colaboradores/:id', checkAuth, deleteColaborador)

export default router