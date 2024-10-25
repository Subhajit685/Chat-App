import jwt from "jsonwebtoken"

const getTokenAndSetCookie = async (id, res) =>{
    const token = jwt.sign({id}, process.env.SECRET_KEY, {expiresIn : "1d"})
    res.cookie("jwt", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: "Strict", // prevents CSRF
        secure: true, // use HTTPS in production
    })

}

export default getTokenAndSetCookie