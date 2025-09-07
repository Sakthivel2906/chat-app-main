// contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext({});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      const newSocket = io('http://localhost:5000', {
        auth: { token },
        transports: ['websocket', 'polling'], // Explicitly set transports
      });

      newSocket.on('connect', () => {
        console.log('Connected to server');
        newSocket.emit('join-rooms');
      });

      newSocket.on('user-online', (userId) => {
        setOnlineUsers((prev) => [...prev, userId]);
      });

      newSocket.on('user-offline', (userId) => {
        setOnlineUsers((prev) => prev.filter((id) => id !== userId));
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [token]);

  const value = {
    socket,
    onlineUsers,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
