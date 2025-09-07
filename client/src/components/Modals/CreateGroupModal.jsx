// components/Modals/CreateGroupModal.jsx
import React, { useState, useEffect } from 'react';
import { userAPI, roomAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const CreateGroupModal = ({ onClose, onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      const filteredUsers = response.data.users.filter(
        (user) => user._id !== currentUser.id
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUserToggle = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim() || selectedUsers.length === 0) return;

    setLoading(true);
    try {
      const response = await roomAPI.createRoom({
        name: groupName,
        type: 'group',
        participants: selectedUsers,
      });

      onGroupCreated(response.data.room);
      onClose();
    } catch (error) {
      console.error('Failed to create group:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg w-full max-w-md p-6'>
        <h2 className='text-xl font-bold mb-4'>Create New Group</h2>

        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Group Name
            </label>
            <input
              type='text'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              placeholder='Enter group name'
              required
            />
          </div>

          <div className='mb-4'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Select Members
            </label>
            <div className='max-h-60 overflow-y-auto border rounded-lg'>
              {users.map((user) => (
                <label
                  key={user._id}
                  className='flex items-center p-3 hover:bg-gray-50 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserToggle(user._id)}
                    className='mr-3'
                  />
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${user.username}&background=3b82f6&color=fff`
                    }
                    alt={user.username}
                    className='w-8 h-8 rounded-full mr-3'
                  />
                  <span className='font-medium'>{user.username}</span>
                </label>
              ))}
            </div>
            <p className='text-sm text-gray-500 mt-1'>
              {selectedUsers.length} users selected
            </p>
          </div>

          <div className='flex space-x-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>
              Cancel
            </button>
            <button
              type='submit'
              disabled={
                loading || !groupName.trim() || selectedUsers.length === 0
              }
              className='flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50'>
              {loading ? 'Creating...' : 'Create Group'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;
