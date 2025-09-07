// components/Chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ users }) => {
  if (users.length === 0) return null;

  return (
    <div className='px-6 py-2 text-sm text-gray-500 italic'>
      <div className='flex items-center space-x-1'>
        <div className='typing-indicator'>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span>
          {users.length === 1
            ? 'Someone is typing...'
            : `${users.length} people are typing...`}
        </span>
      </div>
    </div>
  );
};

export default TypingIndicator;
