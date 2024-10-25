import mongoose from "mongoose";

const dbconnection = async () =>{
    try {
        mongoose.connect(process.env.DATA_BASE).then(()=>{
            console.log("Database connected")
        })
    } catch (error) {
        console.log(error)
    }
}

export default dbconnection