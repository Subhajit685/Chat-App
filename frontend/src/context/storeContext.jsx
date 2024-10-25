import { createContext, useEffect, useState } from "react"

export const StoreContext = createContext(null)

const ContextProvider = (props) =>{

    const url = "http://localhost:4000"

    const [user, setuser] = useState(null)
    const [message, setmessage] = useState("")
    const [messages, setmessages] = useState(null)

    const checkUser = async()=>{
        try {
            const res = await fetch(`${url}/api/user/check`, {
                method : "GET",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                }
            })

            const data = await res.json()
            if(data.success){
                setuser(data.user)
            }

        } catch (error) {
            console.log("checkUser", error)
            setuser(null)
        }
    }



    const contextValue = {
        url, checkUser, user, setuser, message, setmessage, messages, setmessages
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default ContextProvider