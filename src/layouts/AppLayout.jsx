import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/ui/Header'

const AppLayout = () => {
  return (
    <div>
      <div className='grid-background'></div>
      <main className='min-h-screen container'>
        <Header/>
      <Outlet/>
      </main>
      <footer className="p-10 text-center bg-gray-900/80 backdrop-blur-sm border-t border-border/50 mt-10 text-muted-foreground font-medium">
        © {new Date().getFullYear()} Student Career Internship Portal. All rights reserved.
      </footer>
    </div>
  )
}

export default AppLayout
