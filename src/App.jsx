import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Manager from './components/Manager'
import Signup from './components/Signup'
import { io } from 'socket.io-client';
import socketContext from './contexts/socketContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SingleTodo from './components/SingleTodo';
// Use HTTPS in production



function App() {
  const socket = io('https://kandan-board-osu6.onrender.com');
  // useEffect(() => {


  //   return () => {
  //     socket.disconnect()
  //   }
  // }, [])


  return (
    <socketContext.Provider value={socket}>


      <div className=' bg-[#FFFAEC] h-[100vh]'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/main" element={<> <Navbar /><Manager /></>} />
          </Routes>




        </BrowserRouter>
      </div>

    </socketContext.Provider >
  )
}

export default App
