import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../context/storeContext';

function Login() {

    const {url, setuser} = useContext(StoreContext)

    const nevigate = useNavigate()

    const [frondata, setfromdata] = useState({
        username: '',
        password: ''
    })
    const [formError, setFormError] = useState('');
    const [isLogin, setIsLogin] = useState(false)

    const hendleChange = (e) => {
        const { name, value } = e.target
        setfromdata({ ...frondata, [name]: value })
    }

    const hendleSubmit = async (e) => {
        e.preventDefault()

        const { username, password } = frondata

        if (!username || !password) {
            setFormError("Please fill in all fields.")
            return
        }

        setFormError('');

        try {
            setIsLogin(true)
            const res = await fetch(`${url}/api/user/login`, {
                method: "POST",
                credentials : 'include',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({userName : frondata.username, password : frondata.password})
            })
    
            
            const data = await res.json()
            if(data.success){
                setuser(data.user)
                setIsLogin(false)
                nevigate("/chat")
            } else{
                setFormError(data.message);
            }
        } catch (error) {
            console.log("login", error)
            setIsLogin(false)
        }

        
    }


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                {formError && (
                    <div className="p-4 text-sm text-red-600 bg-red-100 rounded-lg">
                        {formError}
                    </div>
                )}
                <form className="space-y-4" onSubmit={hendleSubmit}>
                    <div>
                        <label htmlFor="user" className="block mb-1 text-sm font-medium text-gray-600">
                            User Name
                        </label>
                        <input
                            type="text"
                            id="user"
                            value={frondata.username}
                            name='username'
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your user name"
                            onChange={hendleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name='password'
                            value={frondata.password}
                            className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            onChange={hendleChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Link to={"/"} className="text-sm text-blue-500 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Sign In
                    </button>
                </form>
                <div className="text-sm text-center text-gray-600">
                    Don't have an account?{' '}
                    <Link to={"/signup"} className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
