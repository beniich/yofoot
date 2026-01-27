import { Server } from "socket.io"

export const initSocket = (server) => {
    const io = new Server(server, { cors: { origin: "*" } })

    io.on("connection", socket => {
        console.log("Client connected via WebSocket")

        socket.on("join-live", () => {
            socket.join("live")
            console.log("Client joined live room")
        })

        socket.on("leave-live", () => {
            socket.leave("live")
        })

        socket.on("disconnect", () => {
            console.log("Client disconnected")
        })
    })

    return io
}
