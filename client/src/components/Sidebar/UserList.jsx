// components/Sidebar/UserList.jsx
import React, { useState, useEffect } from 'react';
import { userAPI, roomAPI } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';

const UserList = ({ onSelectUser, onRoomCreated }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { onlineUsers } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      // Filter out current user
      const filteredUsers = response.data.users.filter(
        (user) => user._id !== currentUser.id
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    try {
      // Create or get existing private room
      const response = await roomAPI.createRoom({
        type: 'private',
        participants: [user._id],
      });

      // Switch to the created/existing room
      onRoomCreated(response.data.room);
    } catch (error) {
      console.error('Failed to create room:', error);
    }
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div>
      <div className='p-4 border-b bg-gray-50'>
        <h3 className='font-semibold text-gray-700'>Start New Conversation</h3>
      </div>
      {users.length === 0 ? (
        <div className='p-4 text-center text-gray-500'>No users available</div>
      ) : (
        users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);

          return (
            <div
              key={user._id}
              className='p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors'
              onClick={() => handleUserClick(user)}>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`
                    }
                    alt={user.username}
                    className='w-10 h-10 rounded-full'
                  />
                  {isOnline && (
                    <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white'></span>
                  )}
                </div>
                <div className='flex-1'>
                  <h3 className='font-semibold'>{user.username}</h3>
                  <p className='text-sm text-gray-500'>
                    {isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserList;
