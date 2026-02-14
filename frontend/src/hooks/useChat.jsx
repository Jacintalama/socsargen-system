import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getSocketURL } from '../utils/url';

const SOCKET_URL = getSocketURL();
const CHAT_SESSION_KEY = 'sch_chat_session';

// Generate or get existing session ID
const getOrCreateSessionId = () => {
  let sessionData = localStorage.getItem(CHAT_SESSION_KEY);
  if (sessionData) {
    try {
      return JSON.parse(sessionData);
    } catch (e) {
      localStorage.removeItem(CHAT_SESSION_KEY);
    }
  }
  // Create new session
  const newSession = {
    sessionId: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(newSession));
  return newSession;
};

export const useChat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isEscalated, setIsEscalated] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const session = getOrCreateSessionId();
    setSessionId(session.sessionId);

    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);

      // Get user if logged in
      let user = null;
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          user = JSON.parse(userData);
        }
      } catch (e) {
        console.error('Error parsing user data:', e);
      }

      console.log('=== SOCKET CONNECTED ===');
      console.log('Socket ID:', newSocket.id);
      console.log('Session ID:', session.sessionId);

      // Restore session - send sessionId to backend
      newSocket.emit('restore_session', {
        sessionId: session.sessionId,
        userId: user?.id || null
      });
    });

    // Session restored with history
    newSocket.on('session_restored', (data) => {
      console.log('Session restored:', data);

      if (data.messages && data.messages.length > 0) {
        // Load existing messages with staff names
        setMessages(data.messages.map(msg => ({
          text: msg.message,
          sender: msg.sender,
          staffName: msg.staff_name || null,
          timestamp: new Date(msg.created_at)
        })));
      } else {
        // No history, show welcome message
        setMessages([{
          text: "Hello! Welcome to Socsargen Hospital. I'm your virtual assistant. How can I help you today?",
          sender: 'bot',
          timestamp: new Date()
        }]);
      }

      // Restore escalation status
      if (data.isEscalated) {
        setIsEscalated(true);
      }
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('chat_response', (data) => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.sender,
        staffName: data.staffName || null,
        timestamp: new Date(data.timestamp)
      }]);
    });

    newSocket.on('chat_escalated', (data) => {
      console.log('=== CHAT ESCALATED RECEIVED ===');
      console.log('Data:', data);
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

      // Clear session so next chat starts fresh
      localStorage.removeItem(CHAT_SESSION_KEY);
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
    // Clear localStorage session
    localStorage.removeItem(CHAT_SESSION_KEY);

    // Generate new session
    const newSession = {
      sessionId: 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem(CHAT_SESSION_KEY, JSON.stringify(newSession));
    setSessionId(newSession.sessionId);

    setMessages([{
      text: "Hello! Welcome to Socsargen Hospital. I'm your virtual assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setIsEscalated(false);
  }, []);

  const requestHumanAssistance = useCallback(() => {
    console.log('=== REQUEST HUMAN ASSISTANCE ===');
    console.log('Socket:', socket?.id);
    console.log('Is escalated:', isEscalated);

    if (socket && !isEscalated) {
      console.log('Emitting request_human_assistance...');
      socket.emit('request_human_assistance');
    } else {
      console.log('Cannot request - socket:', !!socket, 'escalated:', isEscalated);
    }
  }, [socket, isEscalated]);

  return {
    messages,
    sendMessage,
    clearChat,
    isConnected,
    isEscalated,
    isTyping,
    requestHumanAssistance
  };
};
