import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import socketContext from '../contexts/socketContext';
import { Link, useNavigate } from 'react-router-dom';
const Signup = () => {
  const push = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [validation, setvalidation] = useState({
    name: false,
    email: false,
    password: false
  })
  const [loading, setLoading] = useState(false)
  const socket = useContext(socketContext)




  function validateForm({ name, email, password }) {


    // Username: At least 3 characters, letters/numbers only
    if (!name || name.trim().length < 3) {
      
      setvalidation(prev => ({ ...prev, name: true }))
      return false
    }


    // Email: Basic pattern check

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setvalidation(prev => ({ ...prev, email: true }))
      return false
    }



    // Password: Min 8 characters, with letters & numbers
    if (!password || password.length < 8) {
      setvalidation(prev => ({ ...prev, password: true }))
      return false
    }
    setvalidation({
      name: false,
      email: false,
      password: false
    })
    return true


  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {

    e.preventDefault();
    if (validateForm(form)) {
      setLoading(true)
      fetch("http://localhost:5000/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).then((res) => {

        return res.json()

      }).then((data) => {
        setLoading(false)
        if (data.code == 2) {
          setTimeout(() => {
            push("/login", { replace: true })
          }, 900);
        }
        else if(data.code == 1){
          alert("user already exist please Login")
          push("/login" , {replace : true})
        }
        else {
          alert("some error please try again ")
        }
        setForm({ name: '', email: '', password: '' })
      }).catch((error) => {
        console.error('❌ Error:', error.message);
      })




    }



  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-[#FFFAEC]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Create an Account</h2>
        <form className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className={validation.username ? "bg-red-500 p-2" : "hidden opacity-0"}>
            Username must be at least 3 characters long.
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className={validation.email ? "bg-red-500 p-2" : "hidden"}>
            Please enter a valid email address.
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            required
          />
          <div className={validation.password ? "bg-red-500 p-2" : "hidden"}>
            Password must be at least 8 characters long.
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 rounded hover:bg-indigo-600 transition duration-300"
          >
            {loading ? "loading.." : "signup"}
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account? <Link to="/login" className="text-indigo-500 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;