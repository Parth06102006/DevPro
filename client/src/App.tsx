import './App.css'
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'

const App = () => {
  return (
    <div className='dark bg-[#040212] w-full'>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route/>
      </Routes>
    </div>
  )
}

export default App