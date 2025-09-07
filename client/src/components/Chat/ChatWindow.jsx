// components/Chat/ChatWindow.jsx
import React, { useState, useEffect } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import { roomAPI } from '../../services/api';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ roomId, roomName }) => {
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    socket.on('new-message', (message) => {
      if (message.room === roomId) {
        setMessages((prev) => [...prev, message]);
      }
    });

    // Typing indicators
    socket.on('user-typing', ({ userId, roomId: typingRoomId }) => {
      if (typingRoomId === roomId) {
        setTypingUsers((prev) => [...prev, userId]);
      }
    });

    socket.on('user-stopped-typing', ({ userId, roomId: typingRoomId }) => {
      if (typingRoomId === roomId) {
        setTypingUsers((prev) => prev.filter((id) => id !== userId));
      }
    });

    return () => {
      socket.off('new-message');
      socket.off('user-typing');
      socket.off('user-stopped-typing');
    };
  }, [socket, roomId]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await roomAPI.getMessages(roomId);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = (content) => {
    if (!socket || !content.trim()) return;

    socket.emit('send-message', {
      roomId,
      content,
      type: 'text',
    });
  };

  if (!roomId) {
    return (
      <div className='flex items-center justify-center h-full bg-gray-50'>
        <p className='text-gray-500'>Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='bg-white border-b px-6 py-4'>
        <h2 className='text-xl font-semibold'>{roomName}</h2>
      </div>

      <div className='flex-1 overflow-hidden bg-gray-50'>
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        ) : (
          <MessageList messages={messages} />
        )}
      </div>

      {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}

      <MessageInput onSend={sendMessage} roomId={roomId} />
    </div>
  );
};

export default ChatWindow;
