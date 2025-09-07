// pages/Chat.jsx
import React, { useState } from 'react';
import RoomList from '../components/Sidebar/RoomList';
import UserList from '../components/Sidebar/UserList';
import ChatWindow from '../components/Chat/ChatWindow';
import UserProfile from '../components/Sidebar/UserProfile';
import CreateGroupModal from '../components/Modals/CreateGroupModal';

const Chat = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [sidebarView, setSidebarView] = useState('rooms'); // 'rooms' or 'users'
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [refreshRooms, setRefreshRooms] = useState(0);

  const handleRoomSelect = (room) => {
    setSelectedRoom({
      id: room._id,
      name: room.name || getRoomName(room),
      type: room.type,
      participants: room.participants,
    });
    setSidebarView('rooms');
  };

  const getRoomName = (room) => {
    if (room.name) return room.name;
    // For private chats, show the other user's name
    const otherUser = room.participants.find((p) => p._id !== room._id);
    return otherUser?.username || 'Unknown User';
  };

  const handleRoomCreated = (room) => {
    setRefreshRooms((prev) => prev + 1); // Trigger room list refresh
    handleRoomSelect(room);
  };

  return (
    <div className='flex h-screen'>
      {/* Sidebar */}
      <div className='w-80 bg-white border-r flex flex-col'>
        <UserProfile />

        <div className='flex border-b'>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              sidebarView === 'rooms'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSidebarView('rooms')}>
            Chats
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
              sidebarView === 'users'
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setSidebarView('users')}>
            New Chat
          </button>
        </div>

        {sidebarView === 'rooms' && (
          <div className='p-2 border-b'>
            <button
              onClick={() => setShowCreateGroup(true)}
              className='w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium'>
              + Create Group
            </button>
          </div>
        )}

        <div className='flex-1 overflow-y-auto'>
          {sidebarView === 'rooms' ? (
            <RoomList
              key={refreshRooms}
              selectedRoom={selectedRoom}
              onSelectRoom={handleRoomSelect}
            />
          ) : (
            <UserList onRoomCreated={handleRoomCreated} />
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className='flex-1'>
        <ChatWindow
          roomId={selectedRoom?.id}
          roomName={selectedRoom?.name}
          roomType={selectedRoom?.type}
          participants={selectedRoom?.participants}
        />
      </div>

      {/* Create Group Modal */}
      {showCreateGroup && (
        <CreateGroupModal
          onClose={() => setShowCreateGroup(false)}
          onGroupCreated={handleRoomCreated}
        />
      )}
    </div>
  );
};

export default Chat;
