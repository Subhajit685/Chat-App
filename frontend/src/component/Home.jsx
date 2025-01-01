// src/App.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  // State to check if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const nevigate = useNavigate()

  // Mock login function to simulate logging in
  const handleLogin = () => {
    nevigate("/login")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {isLoggedIn ? (
        // If user is logged in, show chat interface or chat rooms
        <div className="w-full max-w-4xl p-6 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-800">Welcome to the Chat App</h2>
          <p className="text-lg text-center text-gray-600">Join a chat room or start a new conversation with your friends!</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Example of chat room items */}
            <div className="p-4 bg-blue-50 rounded-lg shadow hover:bg-blue-100">
              <h3 className="text-xl font-semibold text-blue-600">General Chat Room</h3>
              <p className="mt-1 text-gray-600">Join the conversation in the general chat room.</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg shadow hover:bg-green-100">
              <h3 className="text-xl font-semibold text-green-600">Work Chat</h3>
              <p className="mt-1 text-gray-500">Discuss work-related topics with your team.</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg shadow hover:bg-purple-100">
              <h3 className="text-xl font-semibold text-purple-600">Friends' Chat</h3>
              <p className="mt-1 text-gray-600">Catch up with your friends here.</p>
            </div>
          </div>
        </div>
      ) : (
        // If user is not logged in, show login prompt
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800">You are not logged in</h2>
          <p className="text-center text-gray-600">To join a chat room, please login.</p>
          <button
            onClick={handleLogin}
            className="w-full px-4 py-2 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login Here
          </button>
          <div className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <Link to={"/signup"} className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
