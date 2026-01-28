import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Message from './models/Message.js';

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000
  });

  // Store connected users
  const connectedUsers = new Map();

  // Middleware for socket authentication
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        // Allow anonymous connections for public features
        socket.userId = null;
        socket.username = `Guest${Math.floor(Math.random() * 10000)}`;
        return next();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);

      if (!user || !user.isActive) {
        return next(new Error('Authentication failed'));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      socket.userPlan = user.plan;

      next();
    } catch (error) {
      console.error('Socket auth error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`✅ Socket connected: ${socket.id} (${socket.username})`);

    // Store user connection
    if (socket.userId) {
      connectedUsers.set(socket.userId, {
        socketId: socket.id,
        username: socket.username,
        plan: socket.userPlan,
        connectedAt: new Date()
      });
    }

    // Emit current online count
    io.emit('online_count', connectedUsers.size);

    // ========== LIVE SCORES ==========

    socket.on('subscribe_live_scores', () => {
      socket.join('live_scores');
      console.log(`${socket.username} subscribed to live scores`);
    });

    socket.on('unsubscribe_live_scores', () => {
      socket.leave('live_scores');
      console.log(`${socket.username} unsubscribed from live scores`);
    });

    // Subscribe to specific match
    socket.on('subscribe_match', (matchId) => {
      socket.join(`match_${matchId}`);
      console.log(`${socket.username} subscribed to match ${matchId}`);
    });

    socket.on('unsubscribe_match', (matchId) => {
      socket.leave(`match_${matchId}`);
    });

    // ========== CHAT ==========

    socket.on('join_chat_room', async (roomId) => {
      socket.join(`chat_${roomId}`);

      try {
        // Load chat history
        const messages = await Message.find({ room: roomId })
          .populate('user', 'username avatar')
          .sort({ createdAt: -1 })
          .limit(50);

        socket.emit('chat_history', messages.reverse());

        // Notify others
        socket.to(`chat_${roomId}`).emit('user_joined', {
          username: socket.username,
          timestamp: new Date()
        });

        console.log(`${socket.username} joined chat room: ${roomId}`);
      } catch (error) {
        console.error('Error loading chat history:', error);
        socket.emit('error', { message: 'Failed to load chat history' });
      }
    });

    socket.on('leave_chat_room', (roomId) => {
      socket.leave(`chat_${roomId}`);
      socket.to(`chat_${roomId}`).emit('user_left', {
        username: socket.username,
        timestamp: new Date()
      });
    });

    socket.on('send_message', async (data) => {
      if (!socket.userId) {
        return socket.emit('error', { message: 'Authentication required to send messages' });
      }

      try {
        const { roomId, content } = data;

        // Validate message
        if (!content || content.trim().length === 0) {
          return socket.emit('error', { message: 'Message cannot be empty' });
        }

        if (content.length > 500) {
          return socket.emit('error', { message: 'Message too long (max 500 characters)' });
        }

        // Create message
        const message = await Message.create({
          user: socket.userId,
          room: roomId,
          content: content.trim()
        });

        await message.populate('user', 'username avatar');

        // Broadcast to room
        io.to(`chat_${roomId}`).emit('new_message', message);

        console.log(`Message from ${socket.username} in room ${roomId}`);
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('typing', (roomId) => {
      socket.to(`chat_${roomId}`).emit('user_typing', {
        username: socket.username,
        userId: socket.userId
      });
    });

    socket.on('stop_typing', (roomId) => {
      socket.to(`chat_${roomId}`).emit('user_stop_typing', {
        username: socket.username,
        userId: socket.userId
      });
    });

    // ========== NOTIFICATIONS ==========

    socket.on('subscribe_notifications', () => {
      if (!socket.userId) {
        return socket.emit('error', { message: 'Authentication required' });
      }

      socket.join(`notifications_${socket.userId}`);
      console.log(`${socket.username} subscribed to notifications`);
    });

    // ========== PREDICTIONS ==========

    socket.on('new_prediction', (data) => {
      // Broadcast new prediction to interested users
      socket.broadcast.emit('prediction_update', {
        username: socket.username,
        matchId: data.matchId,
        prediction: data.prediction,
        timestamp: new Date()
      });
    });

    // ========== DISCONNECT ==========

    socket.on('disconnect', (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} (${socket.username}) - Reason: ${reason}`);

      if (socket.userId) {
        connectedUsers.delete(socket.userId);
      }

      // Emit updated online count
      io.emit('online_count', connectedUsers.size);
    });

    // ========== ERROR HANDLING ==========

    socket.on('error', (error) => {
      console.error(`Socket error from ${socket.username}:`, error);
    });
  });

  // ========== SERVER-SIDE EVENTS ==========

  // Broadcast live score updates (called from external service)
  io.broadcastLiveScores = (matches) => {
    io.to('live_scores').emit('live_scores_update', matches);
  };

  // Broadcast specific match update
  io.broadcastMatchUpdate = (matchId, matchData) => {
    io.to(`match_${matchId}`).emit('match_update', matchData);
  };

  // Send notification to specific user
  io.sendNotification = (userId, notification) => {
    io.to(`notifications_${userId}`).emit('notification', notification);
  };

  // Broadcast system announcement
  io.broadcastAnnouncement = (message) => {
    io.emit('system_announcement', {
      message,
      timestamp: new Date()
    });
  };


  console.log('✅ Socket.io initialized');

  return io;
};

export default initializeSocket;

