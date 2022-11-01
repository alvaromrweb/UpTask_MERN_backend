import express from "express"

import { cambiarEstado, deleteTarea, editTarea, getTarea, nuevaTarea } from "../controllers/tareaController.js"
import checkAuth from "../middleware/checkAuth.js"

const router = express.Router()
router.post('/', checkAuth, nuevaTarea)

router.route('/:id')
    .get(checkAuth, getTarea)
    .put(checkAuth, editTarea)
    .delete(checkAuth, deleteTarea)

router.post('/estado/:id', checkAuth, cambiarEstado)

export default router