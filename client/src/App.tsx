import './App.css'
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Create from './pages/Create'

const App = () => {
  return (
    <div className='dark bg-[#040212] w-full'>
      <Routes>
        <Route path='/' element={<Landing/>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/dashboard' element={<Dashboard/>}/>
        <Route path='/sessions' element={<Sessions/>}/>
        <Route path='/create' element={<Create/>}/>
        <Route/>
      </Routes>
    </div>
  )
}

export default App