// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),

  register: (username, email, password) =>
    api.post('/auth/register', { username, email, password }),

  getProfile: () => api.get('/auth/profile'),
};

export const roomAPI = {
  getRooms: () => api.get('/rooms'),

  createRoom: (data) => api.post('/rooms', data),

  getMessages: (roomId) => api.get(`/rooms/${roomId}/messages`),
};

export const userAPI = {
  getUsers: () => api.get('/users'),

  getUser: (userId) => api.get(`/users/${userId}`),
};

export default api;
