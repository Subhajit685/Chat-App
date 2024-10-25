import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participient : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        },
    ],
    message : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Message",
            default : []
        },
    ]
}, {timestamps : true})

const Convetsation = mongoose.model("Convetsation", conversationSchema)

export default Convetsation