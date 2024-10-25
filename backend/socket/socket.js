import { Server } from 'socket.io'
import express from "express"
import http from "http"

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});

export const getmessages = (resiverID) =>{
    return onlineUsers[resiverID]
}

const onlineUsers = {}

io.on('connection', (socket) => {

    const userId = socket.handshake.query.userId;
    if(userId !== "undefined"){
        onlineUsers[userId] = socket.id
    }

    io.emit("getOnlineUsers", Object.keys(onlineUsers));

    socket.on("disconnect", () => {
        delete onlineUsers[userId]
        io.emit("getOnlineUsers", Object.keys(onlineUsers));
    })
});


export { app, server, io }