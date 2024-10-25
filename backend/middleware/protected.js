import jwt from "jsonwebtoken"
import User from "../models/user.model.js"

const protectedUser = async (req, res, next) =>{
    try {
        const token = req.cookies.jwt

        if(!token){
            return res.status(400).json({success : false, message : "User not authorized"})
        }

        const decode = jwt.verify(token, process.env.SECRET_KEY)

        if(!decode){
            return res.status(400).json({success : false, message : "Invalid token"})
        }

        const user = await User.findById(decode.id).select("-password")

        if(!user){
            return res.status(400).json({success : false, message : "User not found"})
        }

        req.user = user

        next()
    } catch (error) {
        console.log("protecedUser", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
}

export default protectedUser