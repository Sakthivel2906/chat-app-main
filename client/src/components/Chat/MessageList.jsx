// components/Chat/MessageList.jsx
import React, { useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const MessageList = ({ messages }) => {
  const { user } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className='h-full overflow-y-auto p-4'>
      {messages.map((message) => {
        const isOwn = message.sender._id === user.id;

        return (
          <div
            key={message._id}
            className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`flex max-w-xs lg:max-w-md ${
                isOwn ? 'flex-row-reverse' : ''
              }`}>
              <div className='flex-shrink-0'>
                <img
                  src={
                    message.sender.avatar ||
                    `https://ui-avatars.com/api/?name=${message.sender.username}`
                  }
                  alt={message.sender.username}
                  className='w-8 h-8 rounded-full'
                />
              </div>

              <div
                className={`mx-2 ${
                  isOwn ? 'items-end' : 'items-start'
                } flex flex-col`}>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    isOwn
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-800 border'
                  }`}>
                  {!isOwn && (
                    <p className='text-xs font-semibold mb-1'>
                      {message.sender.username}
                    </p>
                  )}
                  <p className='text-sm'>{message.content}</p>
                </div>
                <span className='text-xs text-gray-500 mt-1'>
                  {formatTime(message.createdAt)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
