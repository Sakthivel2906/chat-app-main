// components/Chat/MessageInput.jsx
import React, { useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';

const MessageInput = ({ onSend, roomId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { socket } = useSocket();

  const handleTyping = (value) => {
    setMessage(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      socket?.emit('typing-start', { roomId });
    } else if (isTyping && value.length === 0) {
      setIsTyping(false);
      socket?.emit('typing-stop', { roomId });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
      if (isTyping) {
        setIsTyping(false);
        socket?.emit('typing-stop', { roomId });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='border-t bg-white px-6 py-4'>
      <div className='flex space-x-2'>
        <input
          type='text'
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder='Type a message...'
          className='flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          type='submit'
          className='px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors'>
          Send
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
