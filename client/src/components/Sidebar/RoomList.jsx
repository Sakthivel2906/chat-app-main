// components/Sidebar/RoomList.jsx
import React, { useState, useEffect } from 'react';
import { roomAPI } from '../../services/api';
import { useSocket } from '../../contexts/SocketContext';
import { useAuth } from '../../contexts/AuthContext';
import { formatTime } from '../../utils/helper';

const RoomList = ({ selectedRoom, onSelectRoom }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('new-message', (message) => {
      updateRoomLastMessage(message.room, message);
    });

    return () => {
      socket.off('new-message');
    };
  }, [socket]);

  const fetchRooms = async () => {
    try {
      const response = await roomAPI.getRooms();
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRoomLastMessage = (roomId, message) => {
    setRooms((prev) =>
      prev.map((room) =>
        room._id === roomId ? { ...room, lastMessage: message } : room
      )
    );
  };

  const getRoomDisplayName = (room) => {
    if (room.name) return room.name;

    // For private chats, show the other user's name
    const otherUser = room.participants.find((p) => p._id !== currentUser.id);
    return otherUser?.username || 'Unknown User';
  };

  const getRoomAvatar = (room) => {
    if (room.type === 'group') {
      return `https://ui-avatars.com/api/?name=${room.name}&background=3b82f6&color=fff`;
    }

    const otherUser = room.participants.find((p) => p._id !== currentUser.id);
    return (
      otherUser?.avatar ||
      `https://ui-avatars.com/api/?name=${otherUser?.username}&background=3b82f6&color=fff`
    );
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='overflow-y-auto'>
      {rooms?.length === 0 ? (
        <div className='p-4 text-center text-gray-500'>
          <p>No conversations yet</p>
          <p className='text-sm mt-2'>Click "New Chat" to start messaging</p>
        </div>
      ) : (
        rooms?.map((room) => (
          <div
            key={room._id}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedRoom?.id === room._id
                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                : ''
            }`}
            onClick={() => onSelectRoom(room)}>
            <div className='flex items-center space-x-3'>
              <img
                src={getRoomAvatar(room)}
                alt={getRoomDisplayName(room)}
                className='w-12 h-12 rounded-full'
              />
              <div className='flex-1 min-w-0'>
                <div className='flex items-center justify-between'>
                  <h3 className='font-semibold truncate'>
                    {getRoomDisplayName(room)}
                  </h3>
                  {room.lastMessage && (
                    <span className='text-xs text-gray-500'>
                      {formatTime(room.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                {room.lastMessage && (
                  <p className='text-sm text-gray-500 truncate'>
                    {room.lastMessage.sender?.username}:{' '}
                    {room.lastMessage.content}
                  </p>
                )}
                {room.type === 'group' && (
                  <p className='text-xs text-gray-400'>
                    {room.participants.length} members
                  </p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;
