import {createContext, useContext, useEffect, useState} from "react"
import { StoreContext } from "./storeContext"
import io from "socket.io-client"
import resiveSound from "../assets/sounds/resive.wav"

export const SocketContext = createContext(null)

const SocketProvider = ({children}) =>{

    const [socket, setsocket] = useState()
    const [onlineuser, setonlineuser] = useState([])

    const {user, messages, setmessages} = useContext(StoreContext)

    useEffect(()=>{
        if(user){
            const socket = io("https://chat-app-ql6m.onrender.com", {
                query : {
                    userId : user._id
                }
            })
            setsocket(socket)

            socket.on("getOnlineUsers", (users)=>{
                setonlineuser(users)
            })

            return () => socket.close()
        }else{
            if(socket){
                socket.close()
                setsocket(null)
            }
        }
    },[user])

    useEffect(()=>{
        socket?.on("Messages", (message)=>{
            const sound = new Audio(resiveSound)
            sound.play()
            setmessages([...messages, message])
        })
        return () => socket?.off("Messages");
    },[socket, messages, setmessages])

    return (
        <SocketContext.Provider value={{socket, onlineuser}}>
            {children}
        </SocketContext.Provider>
    )
}

export default SocketProvider