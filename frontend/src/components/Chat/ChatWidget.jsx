import { useState, useRef, useEffect } from 'react';
import { FiX, FiSend, FiUser, FiHeart, FiUsers } from 'react-icons/fi';
import { useChat } from '../../hooks/useChat';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const { messages, sendMessage, isConnected, isEscalated, isTyping, requestHumanAssistance, suggestions } = useChat();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput('');
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
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-4 sm:right-4">
      {isOpen ? (
        <div
          className="bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden fixed inset-0 sm:relative sm:inset-auto sm:rounded-2xl sm:w-[380px] sm:h-[550px]"
          role="dialog"
          aria-label="Chat with hospital assistant"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FiHeart className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">SCH Assistant</h3>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></span>
                    <p className="text-sm text-primary-100">
                      {!isConnected ? 'Connecting...' : isEscalated ? 'Connected to staff' : 'Online'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition"
                aria-label="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiHeart className="w-8 h-8 text-primary-600" />
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">Welcome to SCH!</h4>
                <p className="text-gray-500 dark:text-slate-400 text-sm mb-4">How can we help you today?</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(suggestion)}
                      className="bg-primary-50 text-primary-700 text-xs px-3 py-2 rounded-full hover:bg-primary-100 transition font-medium"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && msg.sender !== 'system' && (
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                    <FiHeart className="w-4 h-4 text-primary-600" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 ${
                    msg.sender === 'user'
                      ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                      : msg.sender === 'staff'
                      ? 'bg-green-50 text-green-800 rounded-2xl rounded-bl-md border border-green-200'
                      : msg.sender === 'system'
                      ? 'bg-amber-50 text-amber-800 text-center w-full text-sm rounded-xl border border-amber-200'
                      : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-200 shadow-md rounded-2xl rounded-bl-md border border-gray-100 dark:border-slate-700'
                  }`}
                >
                  {msg.sender === 'staff' && (
                    <div className="flex items-center gap-1 text-xs font-semibold mb-1 text-green-600">
                      <FiUser size={12} />
                      <span>{msg.staffName || 'Staff Member'}</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-primary-200' : 'text-gray-400'}`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <FiHeart className="w-4 h-4 text-primary-600" />
                </div>
                <div className="bg-white dark:bg-slate-800 text-gray-500 px-4 py-3 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Dynamic Suggestions + Talk to Staff */}
          {!isEscalated && messages.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50">
              <div className="flex flex-wrap gap-1.5 mb-1.5">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(suggestion)}
                    className="bg-white dark:bg-slate-700 text-primary-700 dark:text-primary-300 text-xs px-3 py-1.5 rounded-full hover:bg-primary-50 dark:hover:bg-slate-600 transition font-medium border border-gray-200 dark:border-slate-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              {messages.length > 2 && (
                <button
                  onClick={requestHumanAssistance}
                  className="w-full flex items-center justify-center gap-1.5 text-amber-600 hover:text-amber-700 text-xs font-medium py-1.5 hover:bg-amber-50 rounded-lg transition"
                >
                  <FiUsers size={14} />
                  Talk to a staff member
                </button>
              )}
            </div>
          )}

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-900">
            <div className="flex gap-3 items-center">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isEscalated ? "Message staff..." : "Type your message..."}
                className="flex-grow px-4 py-3 bg-gray-50 dark:bg-slate-800 border-0 rounded-xl focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-slate-700 text-sm transition"
                disabled={!isConnected}
                aria-label="Chat message input"
              />
              <button
                type="submit"
                className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-600/30"
                disabled={!isConnected || !input.trim()}
                aria-label="Send message"
              >
                <FiSend size={20} />
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">
              {isEscalated ? 'Connected to staff' : 'Powered by Socsargen County Hospital'}
            </p>
          </form>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-full sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center sm:justify-start gap-0 sm:gap-3 w-14 h-14 sm:w-auto sm:h-auto sm:p-4"
          aria-label="Open chat"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
            <FiHeart className="w-5 h-5" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="font-semibold text-sm">Chat with us</p>
            <p className="text-xs text-primary-200">We're here to help</p>
          </div>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;
