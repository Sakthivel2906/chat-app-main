// components/Sidebar/UserProfile.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <div className='p-4 border-b'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-3'>
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${user?.username}`
            }
            alt={user?.username}
            className='w-10 h-10 rounded-full'
          />
          <div>
            <h3 className='font-semibold'>{user?.username}</h3>
            <p className='text-sm text-gray-500'>Online</p>
          </div>
        </div>
        <button
          onClick={logout}
          className='text-sm text-red-500 hover:text-red-600'>
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
