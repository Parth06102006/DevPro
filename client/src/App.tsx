import './App.css'
import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Create from './pages/Create'
import SavedProjects from './pages/SavedProjects'
import Analyze from './pages/Analyze'
import Footer2 from './components/Footer'

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
        <Route path='/saved' element={<SavedProjects/>}/>
        <Route path='/analyze' element={<Analyze/>}/>
        <Route/>
      </Routes>
        <div className='pt-20'>
        <div className='w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60 blur-sm'></div>
        <Footer2/>
      </div>
    </div>
  )
}

export default App