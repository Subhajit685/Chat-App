import express from "express"
import User from "../models/user.model.js"
import bcryptjs from "bcryptjs"
import getTokenAndSetCookie from "../utils/genTokenAndSetCookie.js"
import protectedUser from "../middleware/protected.js"

const route = express.Router()

route.post("/singup", async(req, res)=>{
    try {
        const {name, userName, password, Cpassword, gender} = req.body

        const user = await User.findOne({userName : userName})
        if(user){
            return res.status(400).json({success : false, message : "User allready exit"})
        }
        
        if(password.length > 8){
            return res.status(400).json({success : false, message : "Password must have 8 character"})
        }
        
        if(password !== Cpassword){
            return res.status(400).json({success : false, message : "Confirm password not match"})
        }

        const boyImage = `https://avatar.iran.liara.run/public/boy?userName=${userName}`
        const girlImage = `https://avatar.iran.liara.run/public/girl?userName=${userName}`

        const salt = await bcryptjs.genSalt(10)
        const hasPassword = await bcryptjs.hash(password, salt)

        const newUser = await User({
            name, 
            userName, 
            password : hasPassword, 
            gender,
            profileImahe : gender === "male" ? boyImage : girlImage
        })

        getTokenAndSetCookie(newUser._id, res)

        await newUser.save()
        res.status(201).json({success : true, user : {...newUser._doc,password : undefined}})
    } catch (error) {
        console.log("singup", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
})

route.post("/login", async(req, res)=>{
    try {
        const {userName, password} = req.body
         const user = await User.findOne({userName : userName})

         if(!user){
            return res.status(400).json({success : false, message : "User not found"})
         }

         const comp = await bcryptjs.compare(password, user.password)

         if(!comp){
            return res.status(400).json({success : false, message : "Invalid cridential"})
         }

         getTokenAndSetCookie(user._id, res)

         res.status(201).json({success : true, user : {...user._doc,password : undefined}})
    } catch (error) {
        console.log("login", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
})

route.get("/logout", async(req, res)=>{
    try {
        res.clearCookie("jwt").status(201).json({success : true, message : "Logout successfully"})
    } catch (error) {
        console.log("logout", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
})

route.get("/check", protectedUser, async(req, res)=>{
    try {
        return res.status(200).json({success : true, user : req.user})
    } catch (error) {
        console.log("check", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
})

route.get("/alluser", protectedUser, async(req,res)=>{
    try {

		const allUsers = await User.find({}).select("-password");

        let users = []

        for(let user of allUsers){
            if(user._id.toString() !== req.user._id.toString()){
                users.push(user)
            }
        }


        res.status(200).json({success : true, users});  // Return the users in the response
    } catch (error) {
        console.log("all User", error)
        return res.status(500).json({success : false, message : "Internal servar error"})
    }
})

route.get("/find", protectedUser, async(req, res)=>{
    try {
        const {name} = req.body

        const user = await User.find({name : name})

        if(!user){
            return res.status(200).json({success : false, message : "No user foubd"})
        }

        return res.status(200).json({success : true, user})
    } catch (error) {
        console.log("find user", error)
        return res.status(500).json({success : false, message : "Internal server error"})
    }
})

export default route