import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom"
import ContextProvider from './context/storeContext.jsx'
import SocketProvider from './context/socketContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ContextProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </ContextProvider>
  </BrowserRouter>
)
