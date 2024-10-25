import express from "express"
import protectedUser from "../middleware/protected.js"
import Convetsation from "../models/conversation.modle.js"
import Message from "../models/message.modle.js"
import User from "../models/user.model.js"
import { getmessages, io } from "../socket/socket.js"

const route = express.Router()


// send message

route.post("/send/:id", protectedUser, async(req, res)=>{
    try {
        const {message} = req.body
        const {id : reciverId} = req.params
        const senderId = req.user._id

        let conversation = await Convetsation.findOne({
            participient : {$all : [reciverId, senderId]}
        })

        if(!conversation){
            conversation = new Convetsation({
                participient : [reciverId, senderId]
            })
        }

        const newMessage = new Message({
            senderID : senderId,
            reciverID : reciverId,
            message : message
        })

        if(newMessage){
            conversation.message.push(newMessage._id)
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        const getMessages = getmessages(reciverId)
        if(getMessages){
            io.to(getMessages).emit("Messages", newMessage)
        }

        return res.status(200).json({success : true, newMessage})
    } catch (error) {
        console.log("message post", error)
        return res.status(500).json({success : false, message : "Internal servar error"})
    }
})

// get message

route.get("/:id", protectedUser, async(req, res)=>{
    try {
        const {id : reciverId} = req.params
        const senderId = req.user._id


        const conversation = await Convetsation.findOne({
            participient : {$all : [reciverId, senderId]}
        }).populate("message")

        if(!conversation){
            return res.status(200).json({success : true, message : null})
        }

        return res.status(200).json({success : true, message : conversation.message})


    } catch (error) {
        console.log("message", error)
        return res.status(500).json({success : false, message : "Internal servar error"})
    }
})


export default route