import Tarea from "../models/Tareas.js";
import Proyecto from "../models/Proyecto.js";


const nuevaTarea = async (req, res) => {
    const { proyecto } = req.body
    const existeProyecto = await Proyecto.findById(proyecto)

    if (!existeProyecto) {
        const error = new Error('El proyecto no existe')
        return res.status(404).json({msg: error.message})
    }

    if(existeProyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(401).json({ msg: error.message })
    }

    try {
        const tarea = new Tarea (req.body)
        const tareaAlmacenada = await tarea.save()

        existeProyecto.tareas.push(tareaAlmacenada._id)
        await existeProyecto.save()
        res.json(tareaAlmacenada)
    } catch (error) {
        console.log(error)
    }

}

const getTarea = async (req, res) => {
    const { id } = req.params

    try {
        
        const tarea = await Tarea.findById( id ).populate("proyecto")

        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        res.json(tarea)

    } catch (error) {
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

}

const editTarea = async (req, res) => {
    const { id } = req.params

    try {
        
        const tarea = await Tarea.findById(id).populate("proyecto")

        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        tarea.nombre = req.body.nombre || tarea.nombre
        tarea.descripcion = req.body.descripcion || tarea.descripcion
        tarea.prioridad = req.body.prioridad || tarea.prioridad
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega

        const tareaEdit = await tarea.save()

        res.json(tareaEdit)

    } catch (error) {
        console.log(error)
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }


}

const deleteTarea = async (req, res) => {
    const { id } = req.params

    try {
        
        const tarea = await Tarea.findById(id).populate("proyecto")

        if(!tarea) {
            const error = new Error("La tarea no existe")
            return res.status(404).json({ msg: error.message })
        }

        if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        const proyecto = await Proyecto.findById(tarea.proyecto)
        proyecto.tareas.pull(tarea._id)

        await Promise.allSettled([await proyecto.save(), await tarea.deleteOne()])

        res.json({ msg: "Tarea eliminada"})

    } catch (error) {
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }
}

const cambiarEstado = async (req, res) => {
    const { id } = req.params

    try {
        
        const tarea = await Tarea.findById(id).populate("proyecto").populate("completado")

        if(!tarea) {
            const error = new Error("La tarea no existe")
            return res.status(404).json({ msg: error.message })
        }


        tarea.estado = !tarea.estado
        tarea.completado = req.usuario._id

        const tareaEdit = await tarea.save()

        const tareaAlmacenada = await Tarea.findById(id).populate("proyecto").populate("completado")

        res.json(tareaAlmacenada)

    } catch (error) {
        console.log(error)
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

}


export {
    nuevaTarea,    
    getTarea,    
    editTarea,    
    deleteTarea, 
    cambiarEstado
}