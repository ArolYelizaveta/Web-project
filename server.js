import { app } from "./rest.js"
import { createServer } from "http"
import { Server } from "socket.io"

const server = createServer(app)
const io = new Server(server)

// Socket.IO logic
io.on("connection", (socket) => {
    console.log("Новый пользователь подключился")

    socket.on("join", (username) => {
        socket.username = username
        socket.broadcast.emit("user joined", username)
        console.log(`${username} вошел в чат`)
    })

    socket.on("chat message", (msg) => {
        io.emit("chat message", {
            username: socket.username,
            text: msg
        })
    })

    socket.on("typing", () => {
        socket.broadcast.emit("typing", socket.username)
    })

    socket.on("stop typing", () => {
        socket.broadcast.emit("stop typing", socket.username)
    })

    socket.on("disconnect", () => {
        if (socket.username) {
            socket.broadcast.emit("user left", socket.username)
            console.log(`${socket.username} отключился`)
        }
    })
})

const port = process.env.PORT || 3000

server.listen(port, () => {
    console.log(`Сервер успешно запущен на порту: ${port}`)
})
