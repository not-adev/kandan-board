import React from 'react'
// import './Navbar.css'
const Navbar = () => {
  return (
    <nav className='bg-[#41644A] p-1 flex justify-around text-white'>
        <div><span className='text-white'> &lt;TO</span><span className='text-green-300'>DO/&gt;</span></div>
       <ul className='flex gap-2'>
        <li className='hover:font-bold cursor-pointer'>Home</li>
        <li className='hover:font-bold cursor-pointer'>About</li>
        <li className='hover:font-bold cursor-pointer'>Contect</li>
       </ul>
    </nav>
  )
}

export default Navbar