import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const NavBar = () => {
  const navigate=useNavigate()
  return (
    <nav className='flex items-center justify-between font-roboto text-lg'>
      <div>
         <img src="/aeroflex-removebg.png" alt="AeroFlex Logo" className='w-28 h-28'/>
     </div>
     <div className='text-white flex gap-7'>
        <Link to="/" className='hover:text-secondary'>Home</Link>
        <Link to="/" className='hover:text-secondary'>Flights</Link>
     </div>
     <div className='flex items-center gap-6'>
        <div className='text-white flex gap-2 items-center'>
            <img src="/india.png" alt="flag" className='w-8 h-5' />
            <h1>India</h1>
        </div>
        <div className='text-white'>
            <h1>Support</h1>
        </div>
        <div>
            <button className='px-6 py-3 border rounded-lg font-semibold border-white text-white hover:bg-blue-600 hover:border-customColor shadow-lg backdrop-blur-md' onClick={()=>navigate('/login')}>SignUp/Login</button>
        </div>
     </div>
   </nav>
  )
}

export default NavBar
