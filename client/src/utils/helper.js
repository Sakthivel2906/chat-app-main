// client/src/utils/helpers.js

/**
 * Format timestamp to display in chat
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string
 */
export const formatTime = (date) => {
  const messageDate = new Date(date);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Check if message is from today
  if (messageDate.toDateString() === today.toDateString()) {
    return messageDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
  // Check if message is from yesterday
  else if (messageDate.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  }
  // For older messages, show date
  else {
    return messageDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year:
        messageDate.getFullYear() !== today.getFullYear()
          ? 'numeric'
          : undefined,
    });
  }
};

/**
 * Format timestamp for last seen
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted last seen string
 */
export const formatLastSeen = (date) => {
  const lastSeenDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now - lastSeenDate) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return formatTime(date);
  }
};

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '?';

  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Generate avatar URL
 * @param {string} name - User or room name
 * @param {string} existingAvatar - Existing avatar URL if any
 * @returns {string} Avatar URL
 */
export const getAvatarUrl = (name, existingAvatar = null) => {
  if (existingAvatar) return existingAvatar;

  const colors = ['3b82f6', '8b5cf6', 'ef4444', '10b981', 'f59e0b', 'ec4899'];
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const bgColor = colors[colorIndex];

  return `https://ui-avatars.com/api/?name=${encodeURIComponent(
    name || 'User'
  )}&background=${bgColor}&color=fff`;
};

/**
 * Check if user is online
 * @param {string} userId - User ID to check
 * @param {string[]} onlineUsers - Array of online user IDs
 * @returns {boolean} Whether user is online
 */
export const isUserOnline = (userId, onlineUsers = []) => {
  return onlineUsers.includes(userId);
};

/**
 * Sort rooms by last message
 * @param {Array} rooms - Array of room objects
 * @returns {Array} Sorted rooms
 */
export const sortRoomsByLastMessage = (rooms) => {
  return [...rooms].sort((a, b) => {
    const aTime = a.lastMessage
      ? new Date(a.lastMessage.createdAt)
      : new Date(a.updatedAt);
    const bTime = b.lastMessage
      ? new Date(b.lastMessage.createdAt)
      : new Date(b.updatedAt);
    return bTime - aTime;
  });
};

/**
 * Get room display name for private chats
 * @param {Object} room - Room object
 * @param {string} currentUserId - Current user's ID
 * @returns {string} Display name
 */
export const getRoomDisplayName = (room, currentUserId) => {
  if (room.name) return room.name;

  // For private chats, show the other user's name
  const otherUser = room.participants?.find((p) => p._id !== currentUserId);
  return otherUser?.username || 'Unknown User';
};

/**
 * Format file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Whether email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with strength and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 6) {
    return {
      isValid: false,
      message: 'Password must be at least 6 characters',
    };
  }

  let strength = 'weak';
  let strengthScore = 0;

  // Check for lowercase
  if (/[a-z]/.test(password)) strengthScore++;
  // Check for uppercase
  if (/[A-Z]/.test(password)) strengthScore++;
  // Check for numbers
  if (/\d/.test(password)) strengthScore++;
  // Check for special characters
  if (/[!@#$%^&*]/.test(password)) strengthScore++;
  // Check for length
  if (password.length >= 10) strengthScore++;

  if (strengthScore >= 4) strength = 'strong';
  else if (strengthScore >= 2) strength = 'medium';

  return {
    isValid: true,
    strength,
    message: `Password strength: ${strength}`,
  };
};

/**
 * Debounce function for search/typing
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeoutId;

  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeoutId);
      func(...args);
    };

    clearTimeout(timeoutId);
    timeoutId = setTimeout(later, wait);
  };
};

/**
 * Group messages by date
 * @param {Array} messages - Array of message objects
 * @returns {Object} Messages grouped by date
 */
export const groupMessagesByDate = (messages) => {
  const groups = {};

  messages.forEach((message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
  });

  return groups;
};

/**
 * Check if message is consecutive (from same sender)
 * @param {Object} currentMessage - Current message
 * @param {Object} previousMessage - Previous message
 * @param {number} timeThreshold - Time threshold in minutes
 * @returns {boolean} Whether messages are consecutive
 */
export const isConsecutiveMessage = (
  currentMessage,
  previousMessage,
  timeThreshold = 5
) => {
  if (!previousMessage) return false;

  const isSameSender = currentMessage.sender._id === previousMessage.sender._id;
  const currentTime = new Date(currentMessage.createdAt);
  const previousTime = new Date(previousMessage.createdAt);
  const timeDiff = (currentTime - previousTime) / (1000 * 60); // Convert to minutes

  return isSameSender && timeDiff < timeThreshold;
};

/**
 * Play notification sound
 * @param {string} soundType - Type of notification sound
 */
export const playNotificationSound = (soundType = 'message') => {
  try {
    const audio = new Audio();

    // You can add different sounds for different notifications
    switch (soundType) {
      case 'message':
        audio.src = '/sounds/message.mp3'; // Add this sound file to public/sounds/
        break;
      case 'notification':
        audio.src = '/sounds/notification.mp3';
        break;
      default:
        audio.src = '/sounds/default.mp3';
    }

    audio.volume = 0.5;
    audio.play().catch((error) => {
      console.log('Could not play notification sound:', error);
    });
  } catch (error) {
    console.log('Error playing sound:', error);
  }
};

/**
 * Request notification permission
 * @returns {Promise<boolean>} Whether permission was granted
 */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

/**
 * Show desktop notification
 * @param {string} title - Notification title
 * @param {Object} options - Notification options
 */
export const showDesktopNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/logo192.png', // Add your app icon
      badge: '/logo192.png',
      ...options,
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }
};

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} Whether copy was successful
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Scroll to bottom of element
 * @param {RefObject} ref - React ref of element
 * @param {string} behavior - Scroll behavior ('smooth' or 'auto')
 */
export const scrollToBottom = (ref, behavior = 'smooth') => {
  if (ref?.current) {
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior,
    });
  }
};

// Export all functions as default object as well
export default {
  formatTime,
  formatLastSeen,
  truncateText,
  getInitials,
  getAvatarUrl,
  isUserOnline,
  sortRoomsByLastMessage,
  getRoomDisplayName,
  formatFileSize,
  isValidEmail,
  validatePassword,
  debounce,
  groupMessagesByDate,
  isConsecutiveMessage,
  playNotificationSound,
  requestNotificationPermission,
  showDesktopNotification,
  copyToClipboard,
  scrollToBottom,
};
