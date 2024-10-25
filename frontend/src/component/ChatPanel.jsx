import React, { useContext, useEffect, useRef, useState } from 'react';
import { GoX } from "react-icons/go";
import { TfiAlignLeft } from "react-icons/tfi";
import { IoSend } from "react-icons/io5";
import { IoSearch } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { StoreContext } from '../context/storeContext';
import { IoIosChatboxes } from "react-icons/io";
import { SocketContext } from '../context/socketContext';
import sendSound from "../assets/sounds/send.mp3"
import { GoArrowLeft } from "react-icons/go";



const ChatPanel = () => {

    const { url, setuser,user, message, setmessage, messages, setmessages } = useContext(StoreContext)
    const {onlineuser} = useContext(SocketContext)

    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setusers] = useState([])
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar state
    const [search, setsearch] = useState("")
    const searchUSer = []
    const [arrow, setarrow] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    const lastMEssage = useRef()

    const hendleLogout = async () => {
        const res = await fetch(`${url}/api/user/logout`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await res.json()
        console.log(data)
        if (data.success) {
            setuser(null)
        }
    }

    const allUser = async () => {
        try {
            const res = await fetch(`${url}/api/user/alluser`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setusers(data.users)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const getMessage = async () => {

        try {
            const res = await fetch(`${url}/api/message/${selectedUser?._id}`, {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                }
            })

            const data = await res.json()
            if (data.success) {
                setmessages(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }

    const hendleSend = async(e) =>{
        e.preventDefault()
        try {
           const res = await fetch(`${url}/api/message/send/${selectedUser?._id}`, {
            method : "POST",
            credentials : "include",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({message : message})
           }) 

           const data = await res.json()
           if(data.success){
               getMessage()
               const sound = new Audio(sendSound)
               sound.play()
               setmessage('')
           }
        } catch (error) {
            console.log(error)
        }
    }

    const hendleSearch = async() =>{
        for(const user of users){
            if(user.name === search){
                searchUSer.push(user)
            }
        }
        setarrow(true)
        setusers(searchUSer)
    }

    const hendleuser = () =>{
        setsearch("")
        setarrow(false)
        allUser()
    }

    useEffect(() => {
        allUser()
    }, [])

    useEffect(() => {
        if (selectedUser) {
            getMessage()
        }
    }, [selectedUser])

    useEffect(()=>{
        setTimeout(() => {
            lastMEssage.current?.scrollIntoView({behavior : "smooth"})
        }, 100);
    },[getMessage])

    useEffect(()=>{
        document.addEventListener("keydown", (e)=>{
            if(e.key === "Enter" && message !== ""){
                hendleSend()
            }
        })
    },[])

    useEffect(()=>{
        document.addEventListener("keydown", (e)=>{
            if(e.key === "Enter" && search !== ""){
                hendleSearch()
            }
        })
    })

    return (
        <div className="flex h-screen">

            {/* Sidebar - User List */}

            <div className={`fixed z-20 top-0 left-0 bottom-0 w-64 bg-gray-800 text-white md:relative md:w-1/4 md:block transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`} >

                <div className='flex items-center justify-between px-4'>
                    <h2 className="pt-4 text-2xl font-semibold">Chats</h2>
                    <div className='text-2xl md:hidden' onClick={toggleSidebar}>
                        <GoX />
                    </div>
                </div>
                <div className='flex w-full items-center p-4 gap-2'>
                    <input type="text" value={search} onChange={(e)=> setsearch(e.target.value)} className='w-full px-4 md:p-2 p-1 rounded-md text-white bg-transparent border' placeholder='search here..' />
                    <div className='md:text-3xl text-2xl border rounded-md p-1 cursor-pointer' onClick={hendleSearch}>
                        <IoSearch />
                    </div>
                </div>
                {
                    arrow && <div className='text-2xl px-4 cursor-pointer' onClick={hendleuser}><GoArrowLeft/></div>
                }
                <div className="flex-grow overflow-y-auto">
                    {users?.map((user) => (
                        <div key={user._id}
                            onClick={() => {
                                setSelectedUser(user);
                                setIsSidebarOpen(false); // Close sidebar on mobile after selecting user
                            }}
                            className={`flex items-center p-4 cursor-pointer hover:bg-gray-700 ${selectedUser?._id === user?._id ? 'bg-gray-700' : ''
                                }`} >

                            <img
                                src={user?.profileImahe}
                                alt={user?.name}
                                className="w-12 h-12 rounded-full mr-4"/>
                            <div>
                                <h3 className="font-semibold">{user?.name}</h3>
                                <p className="text-sm text-gray-400">{onlineuser.includes(user._id.toString()) ? "Active now" : ''}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-4xl fixed bottom-4 left-4 cursor-pointer" onClick={hendleLogout}>
                    <IoLogOutOutline />
                </div>
            </div>



            {/* Main Chat Panel */}
            {
                selectedUser ? (<div className="flex flex-col w-full md:w-3/4 h-full">

                    <div className='flex justify-items-center items-center'>
                        {/* Toggle Button for Mobile and Tablet */}
                        <div className="md:hidden text-3xl font-bold ps-4" onClick={toggleSidebar}>
                            <TfiAlignLeft />
                        </div>

                        <div className="flex items-center p-4 bg-white">
                            <img
                                src={selectedUser?.profileImahe}
                                alt={selectedUser?.name}
                                className="w-12 h-12 rounded-full mr-4"
                            />
                            <h2 className="text-xl font-semibold">{selectedUser?.name}</h2>
                        </div>
                    </div>


                    {/* Chat Messages */}
                    <div className="flex-grow p-6 overflow-y-auto bg-gray-100">
                        {messages?.map((message) => (
                            <div key={message?._id} ref={lastMEssage} className={`flex mb-4 ${message?.senderID === user._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-lg max-w-xs ${message?.senderID === user._id
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-800'
                                        }`} >
                                    {message?.message}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white shadow-md">
                        <form onSubmit={hendleSend} className='flex items-center justify-center'>
                            <input
                                type="text"
                                value={message}
                                onChange={(e)=> setmessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-grow p-1.5 md:p-3 border rounded-lg focus:outline-none focus:ring-1 text-black focus:ring-black bg-transparent"
                            />
                            <button className="md:ml-4 ml-1 px-4 py-2 md:text-3xl text-xl text-black rounded-lg border send">
                                <IoSend />
                            </button>
                        </form>
                    </div>
                </div>)


                    :



                    (<div className='flex justify-center gap-4 items-center mx-auto cursor-pointer' onClick={toggleSidebar}>
                        <h1 className='text-4xl font-bold'>Start Chat</h1><div className='text-4xl'><IoIosChatboxes /></div>
                    </div>)
            }

        </div>
    );
};

export default ChatPanel;
