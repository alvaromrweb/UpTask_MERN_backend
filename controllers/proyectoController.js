import Proyecto from "../models/Proyecto.js";
import Tarea from "../models/Tareas.js";
import Usuario from "../models/Usuario.js";

const getProyectos = async (req, res) => {
    const proyectos = await Proyecto.find({
        '$or' : [
            {'colaboradores': { $in: req.usuario}},
            {'creador': { $in: req.usuario}},
        ]
    }).select('-tareas')

    res.json(proyectos)
}

const nuevoProyecto = async (req, res) => {

    const proyecto = new Proyecto(req.body)
    proyecto.creador = req.usuario._id

    try {
        const proyectoAlmacenado = await proyecto.save()
        res.json(proyectoAlmacenado)
    } catch (error) {
        console.log(error)
    }

}

const getProyecto = async (req, res) => {
    const { id } = req.params

    try {
        
        const proyecto = await Proyecto.findById( id )
            .populate({ 
                path: 'tareas', 
                populate: {path: 'completado', select: 'nombre'}
            })
            .populate('colaboradores', 'nombre email')

        if(proyecto.creador.toString() !== req.usuario._id.toString() && 
        !proyecto.colaboradores.some(colaborador => colaborador._id.toString() === req.usuario._id.toString())) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        res.json(
            proyecto
        )
        
        //res.json(proyecto)

    } catch (error) {
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

}

const editProyecto = async (req, res) => {
    const { id } = req.params

    try {
        
        const proyecto = await Proyecto.findById( id )

        if(proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        proyecto.nombre = req.body.nombre || proyecto.nombre
        proyecto.descripcion = req.body.descripcion || proyecto.descripcion
        proyecto.cliente = req.body.cliente || proyecto.cliente
        proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega

        const proyectoEdit = await proyecto.save()

        res.json(proyectoEdit)

    } catch (error) {
        console.log(error)
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }


}

const deleteProyecto = async (req, res) => {
    const { id } = req.params

    try {
        
        const proyecto = await Proyecto.findById( id )

        if(proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        await proyecto.deleteOne()

        res.json({ msg: "Proyecto eliminado"})

    } catch (error) {
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }
}

const buscarColaborador = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if(!usuario) {
        const errorMsg = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }
    res.json(usuario)
}

const addColaborador = async (req, res) => {
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)

    if(!proyecto) {
        const errorMsg = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(401).json({ msg: error.message })
    }

    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v')

    if(!usuario) {
        const errorMsg = new Error("Usuario no encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

    if(proyecto.creador.toString() === usuario._id.toString()) {
        const errorMsg = new Error("El creador del proyecto no puede ser colaborador")
        return res.status(401).json({ msg: errorMsg.message })
    }

    if(proyecto.colaboradores.includes(usuario._id)) {
        const errorMsg = new Error("El usuario ya pertenece al proyecto")
        return res.status(401).json({ msg: errorMsg.message })
    }

    proyecto.colaboradores.push(usuario._id)
    await proyecto.save()
    res.json({msg: 'Colaborador agregado correctamente'})
}

const deleteColaborador = async (req, res) => {
    const {id} = req.params
    const proyecto = await Proyecto.findById(id)

    if(!proyecto) {
        const errorMsg = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }

    if(proyecto.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Acción no válida")
        return res.status(401).json({ msg: error.message })
    }


    proyecto.colaboradores.pull(req.body.id)
    await proyecto.save()
    res.json({msg: 'Colaborador eliminado correctamente'})
}

const getTareas = async (req, res) => {
    const {id} = req.params

    try {
        
        const proyecto = await Proyecto.findById( id )

        if(proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("Acción no válida")
            return res.status(401).json({ msg: error.message })
        }

        // TODO: tienes que ser creador o colaborador para acceder a esto

        Tarea.find().where('proyecto').equals(id).exec(function (err, docs) {
            
            res.json(docs)
        })

    } catch (error) {
        console.log(error)
        const errorMsg = new Error("No encontrado")
        return res.status(404).json({ msg: errorMsg.message })
    }
    
}

export {
    getProyectos,    
    nuevoProyecto,    
    getProyecto,    
    editProyecto,    
    deleteProyecto,  
    buscarColaborador,  
    addColaborador,    
    deleteColaborador,    
    getTareas,    
}