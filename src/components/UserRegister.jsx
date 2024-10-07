import axios from 'axios';
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const UserRegister = ({ onClose,onSwitchToLogin,setShowSuccess }) => {
    const [register, setRegister] = useState({
        email: "",
        password: "",
        userName: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: ""
    });
    const [view, setView] = useState(false);
    const [confirmView,setConfirmView]=useState(false)
    const [error, setError] = useState("");
    const passwordRef = useRef(register.password);
    const confirmPasswordRef = useRef(register.confirmPassword);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setRegister({ ...register, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (register.password !== register.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await axiosInstance.post('/UserAccount/register', register);
            if (!response.data.flag) setError(response.data.message);
            else {
                setError('');
                setShowSuccess(true)
                setTimeout(() => {
                    setShowSuccess(false); // Hide success message
                    onSwitchToLogin(); // Close modal after the success message is hidden
                }, 3000); // 3000 milliseconds = 3 seconds

            }
        } catch (error) {
            setError(error.message);
        }
    };

    const handleConfirmView=()=>
    {
       setConfirmView(prev=>!prev)
    }

    const handleView = () => {
        setView(prev => !prev);
    };

    return (
       
        <form method='POST'>
        <h1 className="text-3xl text-center mb-6">User Register</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Username"
                    required
                    name='userName'
                    value={register.userName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <i className='fa-solid fa-user absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="First Name"
                    required
                    name='firstName'
                    value={register.firstName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <i className='fa-solid fa-user absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Last Name"
                    required
                    name='lastName'
                    value={register.lastName}
                    onChange={handleChange}
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <i className='fa-solid fa-user absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
            </div>

            <div className="relative mb-6">
                <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    name='phoneNumber'
                    value={register.phoneNumber}
                    onChange={handleChange}
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <i className='fa-solid fa-phone absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
            </div>

            <div className="relative mb-6">
                <input
                    type="email"
                    placeholder="Email"
                    required
                    name='email'
                    value={register.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <i className='bx bxs-envelope absolute right-5 top-1/2 transform -translate-y-1/2 text-2xl text-white'></i>
            </div>

            <div className="relative mb-6">
                <input
                    type={view ? 'text' : 'password'}
                    ref={passwordRef}
                    placeholder="Password"
                    value={register.password}
                    required
                    onChange={handleChange}
                    name='password'
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <div onClick={handleView} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
                    <i className={`fa-solid ${view ? 'fa-eye' : 'fa-eye-slash'} text-2xl text-white`}></i>
                </div>
            </div>

            <div className="relative mb-6">
                <input
                    type={confirmView ? 'text' : 'password'}
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
                    value={register.confirmPassword}
                    required
                    onChange={handleChange}
                    name='confirmPassword'
                    className="w-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none"
                />
                <div onClick={handleConfirmView} className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'>
                    <i className={`fa-solid ${confirmView ? 'fa-eye' : 'fa-eye-slash'} text-2xl text-white`}></i>
                </div>
            </div>
        </div>

        <button
            type="submit"
            onClick={handleLogin}
            className="w-full h-12 bg-blue-500 rounded-full shadow-lg text-white font-semibold hover:bg-blue-600 transition duration-300 mt-6"
        >
            Register
        </button>

        <div className="text-center mt-6 text-md">
            <p>
                Already have an account? {' '}
                <span onClick={onSwitchToLogin} className="text-blue-500 hover:underline font-semibold cursor-pointer">Login</span>
            </p>
        </div>

        {error !== "" && <p className="text-red-500 text-lg mt-2 text-center">{error}</p>}
    </form>

  
    );
};

export default UserRegister;
