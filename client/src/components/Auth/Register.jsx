// components/Auth/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      await register(formData.username, formData.email, formData.password);
      navigate('/chat');
    } catch (error) {
      setError(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100'>
      <div className='bg-white p-8 rounded-lg shadow-md w-96'>
        <h2 className='text-2xl font-bold text-center mb-6'>Register</h2>

        {error && (
          <div className='bg-red-100 text-red-600 p-3 rounded mb-4'>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Username
            </label>
            <input
              type='text'
              name='username'
              value={formData.username}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              minLength={3}
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Email
            </label>
            <input
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Password
            </label>
            <input
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
              minLength={6}
            />
          </div>

          <div className='mb-6'>
            <label className='block text-gray-700 text-sm font-bold mb-2'>
              Confirm Password
            </label>
            <input
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              required
            />
          </div>

          <button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors'>
            Register
          </button>
        </form>

        <p className='text-center mt-4'>
          Already have an account?{' '}
          <Link to='/login' className='text-blue-500 hover:underline'>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
