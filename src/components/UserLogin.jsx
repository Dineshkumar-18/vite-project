import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { useSession } from '../context/SessionContext';
import axiosInstance from '../utils/axiosInstance';
import { Link } from 'react-router-dom';
import { AuthContext, useAuth } from '../context/AuthContext';
import {Role} from '../constants/Role'

const UserLogin = ({ onClose,onSwitchToRegister,setShowSuccess,onLoginSuccess }) => {
  const [userId, setUserId] = useState(null);
  const { setIsLoggedIn } = useContext(AuthContext);
  const [error, setError] = useState('');
  const [login, setLogin] = useState({ email: '', password: '' });
  const [view, setView] = useState(false);
  const { setInitialRole } = useSession();

  const handleChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/UserAccount/login', login);
      if (!response.data.flag) {
        setError(response.data.message);
      } else {
        setError('');
        setInitialRole(Role.USER)
        setShowSuccess(true)
        setTimeout(() => {
          setShowSuccess(false);
          onLoginSuccess() // Hide success message
          onClose(); // Close modal after the success message is hidden
      }, 3000); // 3000 milliseconds = 3 seconds

      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleView = () => {
    setView((prev) => !prev);
  };

  return (
    

        <form method='POST'>
          <h1 className="text-3xl text-center mb-9">User Login</h1>
          <div className="input-box relative w-full h-12 mb-6">
            <input
              type="email"
              placeholder="Email"
              required
              name='email'
              value={login.email}
              onChange={handleChange}
              className="w-full h-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
          <div className="input-box relative w-full h-12 mb-6">
            <input
              type={view ? 'text' : 'password'}
              placeholder="Password"
              value={login.password}
              required
              onChange={handleChange}
              name='password'
              className="w-full h-full bg-transparent border-2 border-white border-opacity-40 rounded-full px-4 py-2 text-white placeholder-gray-400 focus:outline-none"
            />
            <div onClick={handleView} className='cursor-pointer'>
              <i className={`fa-solid ${view ? 'fa-eye' : 'fa-eye-slash'} absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-white`}></i>
            </div>
          </div>

          <button
            type="submit"
            onClick={handleLogin}
            className="btn w-full h-12 bg-blue-500 rounded-full shadow-lg text-white font-semibold hover:bg-blue-600 transition duration-300"
          >
            Login
          </button>
          <div className="register-link text-center mt-6 text-sm">
            
            <Link to={"/forgot-password"} className="text-blue-500 hover:underline font-semibold cursor-pointer">Forgot Password?</Link>
            <p>
              Don't have an account?{' '}
              <span onClick={onSwitchToRegister} className="text-blue-500 hover:underline font-semibold cursor-pointer">Register</span>
            </p>
          </div>
          {error && <p className="text-red-500 text-lg mt-2 text-center">{error}</p>}
        </form>
 
  );
};

export default UserLogin;
