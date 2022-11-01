import express from "express"
import dotenv from "dotenv"
import conectarDb from "./config/db.js"
import usuarioRoutes from "./routes/usuarioRoutes.js"
import proyectoRoutes from "./routes/proyectoRoutes.js"
import tareaRoutes from "./routes/tareaRoutes.js"
import cors from 'cors'

const app = express()
app.use(express.json())

dotenv.config()

conectarDb()

// Configurar CORS
const whitelist = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin, callback) {
        if(whitelist.includes(origin)) {
            // Puede acceder a la API
            callback(null, true)
        } else {
            // No tiene acceso
            callback(new Error('Error de CORS'))
        }
    }
}

app.use(cors(corsOptions))

// Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)

const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
    console.log(`Servidor abierto en el puerto: ${PORT}`)
})

// Socket.io
import { Server } from "socket.io"

const io = new Server(servidor, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.FRONTEND_URL
    }
})

io.on('connection', (socket) => {
    console.log('Conectado a socket.io')

    // Definir eventos de socket.io
    socket.on('abrir proyecto', (idProyecto) => {
        socket.join(idProyecto)
    })
    socket.on('nueva tarea', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('tarea agregada', tarea)
    })
    socket.on('tarea eliminada', (tarea) => {
        const proyecto = tarea.proyecto
        socket.to(proyecto).emit('eliminar tarea', tarea)
    })
    socket.on('tarea actualizada', (tarea) => {
        
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('actualizar tarea', tarea)
    })
    socket.on('tarea completada', (tarea) => {
        const proyecto = tarea.proyecto._id
        socket.to(proyecto).emit('completar tarea', tarea)
    })
})