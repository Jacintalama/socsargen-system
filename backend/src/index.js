require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth.routes');
const doctorsRoutes = require('./routes/doctors.routes');
const appointmentsRoutes = require('./routes/appointments.routes');
const newsRoutes = require('./routes/news.routes');
const servicesRoutes = require('./routes/services.routes');

// Import services
const { handleChatMessage, saveMessage } = require('./services/chat.service');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// ===========================================
// MIDDLEWARE
// ===========================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Request logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ===========================================
// API ROUTES
// ===========================================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Socsargen Hospital API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorsRoutes);
app.use('/api/appointments', appointmentsRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/services', servicesRoutes);

// ===========================================
// SOCKET.IO CHAT HANDLERS
// ===========================================

// Track connected users and escalated sessions
const connectedUsers = new Map();
const escalatedSessions = new Set();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  let sessionId = socket.id;
  let userId = null;
  let isEscalated = false;

  // User authenticates (optional - for logged in users)
  socket.on('authenticate', (data) => {
    userId = data.userId;
    sessionId = data.sessionId || socket.id;
    connectedUsers.set(socket.id, { sessionId, userId });
    console.log('User authenticated:', userId);
  });

  // Handle chat messages
  socket.on('chat_message', async (data) => {
    try {
      const { message } = data;

      if (!message || message.trim() === '') {
        return;
      }

      if (isEscalated || escalatedSessions.has(sessionId)) {
        // Message goes to staff queue
        await saveMessage(sessionId, userId, message, 'user');
        io.to('staff_room').emit('escalated_message', {
          sessionId,
          userId,
          message,
          socketId: socket.id,
          timestamp: new Date()
        });
      } else {
        // AI handles it
        const result = await handleChatMessage(sessionId, userId, message);

        socket.emit('chat_response', {
          message: result.message,
          sender: 'bot',
          timestamp: new Date()
        });

        // Check if should escalate
        if (result.escalate) {
          isEscalated = true;
          escalatedSessions.add(sessionId);
          socket.join('escalated_' + sessionId);

          // Notify staff
          io.to('staff_room').emit('new_escalation', {
            sessionId,
            userId,
            socketId: socket.id,
            timestamp: new Date()
          });

          // Notify user
          socket.emit('chat_escalated', {
            message: 'You are now connected to our staff. Please wait for a response.'
          });
        }
      }
    } catch (error) {
      console.error('Chat message error:', error);
      socket.emit('chat_response', {
        message: 'Sorry, something went wrong. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      });
    }
  });

  // Staff joins staff room
  socket.on('join_staff', () => {
    socket.join('staff_room');
    console.log('Staff member joined:', socket.id);
  });

  // Staff responds to escalated chat
  socket.on('staff_response', async (data) => {
    try {
      const { targetSessionId, message } = data;

      await saveMessage(targetSessionId, null, message, 'staff');

      // Send to user in escalated session
      io.to('escalated_' + targetSessionId).emit('chat_response', {
        message,
        sender: 'staff',
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Staff response error:', error);
    }
  });

  // Staff resolves escalation
  socket.on('resolve_escalation', (data) => {
    const { targetSessionId } = data;
    escalatedSessions.delete(targetSessionId);

    io.to('escalated_' + targetSessionId).emit('escalation_resolved', {
      message: 'Your inquiry has been resolved. Thank you for contacting Socsargen Hospital!'
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    connectedUsers.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});

// ===========================================
// ERROR HANDLING
// ===========================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
});

// ===========================================
// START SERVER
// ===========================================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log('===========================================');
  console.log('  SOCSARGEN HOSPITAL SYSTEM API');
  console.log('===========================================');
  console.log(`  Server running on port ${PORT}`);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log('===========================================');
});

module.exports = { app, io, server };
