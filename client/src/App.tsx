import './App.css'
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute, PublicRoute, PublicAccessRoute } from './components/routes/RouteGuards'
import Landing from './pages/Landing'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sessions from './pages/Sessions'
import Create from './pages/Create'
import SavedProjects from './pages/SavedProjects'
import Analyze from './pages/Analyze'
import Footer2 from './components/Footer'
import {Toaster} from 'react-hot-toast'
import Project from './pages/Project'

const App = () => {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        reverseOrder={true}
        toastOptions={{
          style:{
            color:"white",
            backgroundColor:"#040212",
            border:"1px",
            borderColor:"white"
          }
        }}
      />
      <div className='dark bg-[#040212] w-full' style={{fontFamily:"Quicksand"}}>
        <Routes>
          {/* Public access route - can be accessed by anyone */}
          <Route path='/' element={
            <PublicAccessRoute>
              <Landing/>
            </PublicAccessRoute>
          }/>
          
          {/* Public routes - only unauthenticated users */}
          <Route path='/signup' element={
            <PublicRoute>
              <Signup/>
            </PublicRoute>
          }/>
          <Route path='/login' element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          }/>
          
          {/* Protected routes - only authenticated users */}
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          }/>
          <Route path='/sessions' element={
            <ProtectedRoute>
              <Sessions/>
            </ProtectedRoute>
          }/>
          <Route path='/create' element={
            <ProtectedRoute>
              <Create/>
            </ProtectedRoute>
          }/>
          <Route path='/create/:sessionId' element={
            <ProtectedRoute>
              <Create/>
            </ProtectedRoute>
          }/>
          <Route path='/:sessionId/project' element={
            <ProtectedRoute>
              <Project/>
            </ProtectedRoute>
          }/>
          <Route path='/saved' element={
            <ProtectedRoute>
              <SavedProjects/>
            </ProtectedRoute>
          }/>
          <Route path='/analyze' element={
            <ProtectedRoute>
              <Analyze/>
            </ProtectedRoute>
          }/>
        </Routes>
      </div>
    </AuthProvider>
  )
}

export default App
