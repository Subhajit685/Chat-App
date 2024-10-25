import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    userName : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    },
    profileImahe : {
        type : String,
        default : ""
    },
    gender : {
        type : String,
        required : true
    }
}, {timestamps : true})

const User = mongoose.model("User", userSchema)

export default User