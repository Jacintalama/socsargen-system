import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { FiMessageSquare, FiSend, FiUser, FiCheck, FiClock, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getSocketURL } from '../../utils/url';

const SOCKET_URL = getSocketURL();

const AdminChat = () => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [escalatedChats, setEscalatedChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Get current staff user
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const staffName = user.first_name && user.last_name
    ? `${user.first_name} ${user.last_name}`
    : user.email || 'Staff';

  // Connect to socket and join staff room
  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      // Send staff info when joining
      newSocket.emit('join_staff', { staffName, staffId: user.id });
      toast.success('Connected to chat system');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      toast.error('Disconnected from chat system');
    });

    // New escalation received
    newSocket.on('new_escalation', (data) => {
      setEscalatedChats(prev => {
        const exists = prev.find(c => c.sessionId === data.sessionId);
        if (exists) return prev;
        return [...prev, {
          ...data,
          messages: data.messages || [],
          unread: true,
          lastMessage: data.lastMessage || 'Waiting for response...'
        }];
      });
      toast('New chat needs attention!', { icon: '🔔' });
    });

    // Message from escalated user
    newSocket.on('escalated_message', (data) => {
      setEscalatedChats(prev => prev.map(chat => {
        if (chat.sessionId === data.sessionId) {
          return {
            ...chat,
            messages: [...(chat.messages || []), {
              text: data.message,
              sender: 'user',
              timestamp: data.timestamp
            }],
            unread: chat.sessionId !== selectedChat?.sessionId,
            lastMessage: data.message
          };
        }
        return chat;
      }));

      // Add to messages if this is the selected chat
      if (selectedChat?.sessionId === data.sessionId) {
        setMessages(prev => [...prev, {
          text: data.message,
          sender: 'user',
          timestamp: data.timestamp
        }]);
      }
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Update selected chat's messages when selection changes
  useEffect(() => {
    if (selectedChat) {
      setMessages(selectedChat.messages || []);
      // Mark as read
      setEscalatedChats(prev => prev.map(chat => {
        if (chat.sessionId === selectedChat.sessionId) {
          return { ...chat, unread: false };
        }
        return chat;
      }));
    }
  }, [selectedChat?.sessionId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChat || !socket) return;

    const message = input.trim();
    setInput('');

    // Send to user with staff name
    socket.emit('staff_response', {
      targetSessionId: selectedChat.sessionId,
      message,
      staffName
    });

    // Add to local messages
    const newMessage = {
      text: message,
      sender: 'staff',
      staffName,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);

    // Update chat in list
    setEscalatedChats(prev => prev.map(chat => {
      if (chat.sessionId === selectedChat.sessionId) {
        return {
          ...chat,
          messages: [...(chat.messages || []), newMessage],
          lastMessage: message
        };
      }
      return chat;
    }));
  };

  const handleResolve = () => {
    if (!selectedChat || !socket) return;

    if (window.confirm('Mark this chat as resolved?')) {
      socket.emit('resolve_escalation', {
        targetSessionId: selectedChat.sessionId
      });

      // Remove from list
      setEscalatedChats(prev => prev.filter(c => c.sessionId !== selectedChat.sessionId));
      setSelectedChat(null);
      setMessages([]);
      toast.success('Chat resolved!');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition mb-4"
          >
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chat Support</h1>
              <p className="text-gray-600">Respond to escalated customer inquiries.</p>
            </div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6" style={{ height: 'calc(100vh - 250px)' }}>
          {/* Chat List */}
          <div className="card overflow-hidden flex flex-col">
            <div className="p-4 border-b bg-gray-50">
              <h2 className="font-semibold flex items-center gap-2">
                <FiMessageSquare className="text-primary-600" />
                Escalated Chats
                {escalatedChats.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {escalatedChats.length}
                  </span>
                )}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {escalatedChats.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <FiMessageSquare className="mx-auto text-3xl mb-2 text-gray-300" />
                  <p>No escalated chats</p>
                  <p className="text-sm">Chats will appear here when customers need human assistance</p>
                </div>
              ) : (
                <div className="divide-y">
                  {escalatedChats.map((chat) => (
                    <button
                      key={chat.sessionId}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full p-4 text-left hover:bg-gray-50 transition ${
                        selectedChat?.sessionId === chat.sessionId ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="bg-gray-100 p-2 rounded-full">
                            <FiUser className="text-gray-600" />
                          </div>
                          <span className="font-medium">
                            {chat.userId ? 'Logged User' : 'Guest'}
                          </span>
                        </div>
                        {chat.unread && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {chat.lastMessage || 'Waiting for response...'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                        <FiClock size={12} />
                        {formatTime(chat.timestamp)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 card overflow-hidden flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary-100 p-2 rounded-full">
                      <FiUser className="text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedChat.userId ? 'Logged User' : 'Guest User'}
                      </h3>
                      <p className="text-sm text-gray-500">Session: {selectedChat.sessionId.slice(0, 8)}...</p>
                    </div>
                  </div>
                  <button
                    onClick={handleResolve}
                    className="btn btn-primary flex items-center gap-2 text-sm"
                  >
                    <FiCheck /> Resolve
                  </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <FiAlertCircle className="mx-auto text-3xl mb-2 text-yellow-500" />
                      <p>Customer is waiting for assistance</p>
                      <p className="text-sm">Send a message to start helping</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.sender === 'staff' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-2xl ${
                            msg.sender === 'staff'
                              ? 'bg-primary-600 text-white rounded-br-md'
                              : 'bg-white text-gray-800 shadow rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender === 'staff' ? 'text-primary-200' : 'text-gray-400'
                          }`}>
                            {formatTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className="p-4 border-t bg-white">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your response..."
                      className="flex-1 px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-primary-500"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim()}
                      className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
                    >
                      <FiSend size={20} />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <FiMessageSquare className="mx-auto text-5xl mb-4 text-gray-300" />
                  <h3 className="font-semibold text-lg mb-2">Select a Chat</h3>
                  <p>Choose a conversation from the list to start responding</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
