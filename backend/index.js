import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import dbconnection from "./config/database.js"
import userRoute from "./routes/user.route.js"
import messageRoute from "./routes/message.route.js"
import cors from "cors"
import { app, server } from "./socket/socket.js"
import path from "path"


dotenv.config()
dbconnection()
const PORT = process.env.PORT

app.use(express.json())
app.use(cookieParser())

const _dirname = path.resolve()

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

app.use("/api/user", userRoute)
app.use("/api/message", messageRoute)

app.use(express.static(path.join(_dirname, "/frontend/dist")))
app.get("*", (req,res)=>{
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"))
})

server.listen(PORT, ()=>{
    console.log(`server listen at port ${PORT}`)
})