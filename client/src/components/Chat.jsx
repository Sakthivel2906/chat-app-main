import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [user, setUser] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [room] = useState('general');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const joinChat = async (e) => {
    e.preventDefault();
    if (user.trim()) {
      setIsJoined(true);
      socket.emit('join', room);

      // Load previous messages
      try {
        const response = await axios.get(
          `http://localhost:5000/api/messages/${room}`
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('sendMessage', {
        user,
        text: inputMessage,
        room,
      });
      setInputMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className='min-h-screen bg-gray-100 flex items-center justify-center'>
        <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
          <h2 className='text-2xl font-bold mb-6 text-center text-gray-800'>
            Join Chat Room
          </h2>
          <form onSubmit={joinChat}>
            <input
              type='text'
              placeholder='Enter your name'
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4'
              required
            />
            <button
              type='submit'
              className='w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200'>
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
      <div className='bg-white rounded-lg shadow-xl w-full max-w-2xl h-[600px] flex flex-col'>
        {/* Header */}
        <div className='bg-blue-500 text-white p-4 rounded-t-lg'>
          <h1 className='text-xl font-bold'>Chat Room: {room}</h1>
          <p className='text-sm opacity-90'>Logged in as: {user}</p>
        </div>

        {/* Messages Area */}
        <div className='flex-1 overflow-y-auto p-4 space-y-2'>
          {messages.map((msg) => (
            <div
              key={msg._id || Math.random()}
              className={`flex ${
                msg.user === user ? 'justify-end' : 'justify-start'
              }`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.user === user
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}>
                <p className='font-semibold text-sm'>
                  {msg.user === user ? 'You' : msg.user}
                </p>
                <p className='text-sm'>{msg.text}</p>
                <p className='text-xs mt-1 opacity-70'>
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className='border-t p-4 flex gap-2'>
          <input
            type='text'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder='Type your message...'
            className='flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-200'>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
