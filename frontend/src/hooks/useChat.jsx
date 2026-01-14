import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);

      // Authenticate if user is logged in
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        newSocket.emit('authenticate', { userId: user.id });
      }

      // Add welcome message
      setMessages([{
        text: "Hello! Welcome to Socsargen Hospital. I'm your virtual assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('chat_response', (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.sender,
        timestamp: new Date(data.timestamp)
      }]);
    });

    newSocket.on('chat_escalated', (data) => {
      setIsEscalated(true);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: 'system',
        timestamp: new Date()
      }]);
    });

    newSocket.on('escalation_resolved', (data) => {
      setIsEscalated(false);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: 'system',
        timestamp: new Date()
      }]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const sendMessage = useCallback((message) => {
    if (socket && message.trim()) {
      // Add user message to chat
      setMessages(prev => [...prev, {
        text: message,
        sender: 'user',
        timestamp: new Date()
      }]);

      // Show typing indicator
      setIsTyping(true);

      // Send to server
      socket.emit('chat_message', { message });
    }
  }, [socket]);

  const clearChat = useCallback(() => {
    setMessages([{
      text: "Hello! Welcome to Socsargen Hospital. I'm your virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setIsEscalated(false);
  }, []);

  return {
    messages,
    sendMessage,
    clearChat,
    isConnected,
    isEscalated,
    isTyping
  };
};
