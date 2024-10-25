import Home from "./component/Home"
import Login from "./component/Login"
import {Routes, Route, Navigate} from "react-router-dom"
import SignUp from "./component/SignUp"
import ChatPanel from "./component/ChatPanel"
import { useContext, useEffect } from "react"
import { StoreContext } from "./context/storeContext"


function App() {

  const {checkUser, user} = useContext(StoreContext)

  useEffect(()=>{
    checkUser()
  }, [])

  return (
    <div >
    <Routes>
      <Route path="/" element={!user ? <Home/> : <Navigate to={"/chat"}/>}></Route>
      <Route path="/login" element={!user ? <Login/> : <Navigate to={"/chat"}/>}></Route>
      <Route path="/signup" element={!user ? <SignUp/> : <Navigate to={"/chat"}/>}></Route>
      <Route path="/chat" element={user ? <ChatPanel/> : <Navigate to={"/"}/>}></Route>
    </Routes>
    </div>
  )
}

export default App
