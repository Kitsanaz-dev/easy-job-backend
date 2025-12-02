const jwt = require('jsonwebtoken');
const User = require('./models/User');
const ChatHistory = require('./models/ChatHistory');

const GLOBAL_ROOM = 'global';
const userSockets = new Map(); // userId -> Set<socket>

const getDirectRoom = (idA, idB) => {
  if (!idA || !idB) return null;
  const [a, b] = [String(idA), String(idB)].sort();
  return `dm:${a}:${b}`;
};

const parseDirectRoom = (room) => {
  if (!room?.startsWith('dm:')) return null;
  const [, first, second] = room.split(':');
  if (!first || !second) return null;
  return [first, second];
};

async function emitChatHistory(socket, room = GLOBAL_ROOM) {
  try {
    const history = await ChatHistory.findOne({ room }).lean();
    socket.emit('chat_history', {
      room,
      roomType: history?.roomType || (room === GLOBAL_ROOM ? 'global' : 'direct'),
      participants: (history?.participants || []).map((p) => p.toString()),
      messages: history?.messages || []
    });
  } catch (err) {
    console.log('Failed to load chat history:', err.message);
  }
}

async function persistChatMessage({ room, roomType, senderLabel, senderId, content, timestamp, participantIds = [] }) {
  try {
    const participants = Array.from(new Set(
      [senderId, ...participantIds].filter(Boolean).map(String)
    ));

    const update = {
      $push: { messages: { sender: senderLabel, senderId, content, timestamp } },
      $setOnInsert: { room, roomType: roomType || 'global' }
    };

    if (participants.length) {
      update.$addToSet = { participants: { $each: participants } };
    } else {
      update.$setOnInsert.participants = [];
    }

    await ChatHistory.findOneAndUpdate(
      { room },
      update,
      { new: true, upsert: true }
    );
  } catch (err) {
    console.log('Failed to persist chat message:', err.message);
  }
}

module.exports = function initSocket(io) {
  io.on('connect', async (socket) => {
    // Try to read token from handshake (client should send { auth: { token } } on connect)
    const token = socket.handshake?.auth?.token || socket.handshake?.query?.token;
    let connectedUser = null;
    let displayName = 'Guest';

    // Join global room immediately and send its history
    socket.join(GLOBAL_ROOM);
    await emitChatHistory(socket, GLOBAL_ROOM);

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        connectedUser = await User.findById(payload.userID).select('-password');
        socket.user = connectedUser; // attach user to socket for later use
        displayName = connectedUser?.name || connectedUser?.email || displayName;
        const userInfo = connectedUser ? `${connectedUser.name} <${connectedUser.email}>` : payload.userID;
        console.log(`✅ User connected: ${userInfo}`);
        if (connectedUser?._id) {
          const uid = String(connectedUser._id);
          if (!userSockets.has(uid)) userSockets.set(uid, new Set());
          userSockets.get(uid).add(socket);
          // Send direct chat histories for this user on connect
          const histories = await ChatHistory.find({
            roomType: 'direct',
            participants: uid
          }).lean();
          for (const hist of histories) {
            socket.emit('chat_history', {
              room: hist.room,
              roomType: hist.roomType || 'direct',
              participants: (hist.participants || []).map((p) => p.toString()),
              messages: hist.messages || []
            });
          }
        }

        // When the client confirms a login-driven socket connection, log the username
        socket.on('connected', (usernameFromClient) => {
          const username = connectedUser?.name || usernameFromClient || connectedUser?.email || 'Unknown user';
          console.log(`${username} connected`);
        });
        
        // Broadcast to all clients that a user connected
        io.emit('user_connected', {
          userId: connectedUser?._id,
          name: connectedUser?.name || 'Unknown',
          email: connectedUser?.email || 'N/A',
          socketId: socket.id
        });
      } catch (err) {
        console.log('Socket auth error:', err.message);
      }
    } else {
      console.log('No token provided for socket', socket.id);
    }

    // Register disconnect handler at top level so it fires regardless of other events
    socket.on('disconnect', () => {
      const user = connectedUser ? (connectedUser.name || connectedUser.email) : displayName;
      console.log(`${user} disconnected`);
      if (connectedUser?._id) {
        const uid = String(connectedUser._id);
        const set = userSockets.get(uid);
        if (set) {
          set.delete(socket);
          if (set.size === 0) {
            userSockets.delete(uid);
          }
        }
      }
      
      // Broadcast to all clients that a user disconnected
      io.emit('user_disconnected', {
        userId: connectedUser?._id,
        name: connectedUser?.name || user,
        email: connectedUser?.email || 'N/A',
        socketId: socket.id
      });
    });

    // Optional friendly name override for guests
    socket.on('newuser', (name) => {
      displayName = name || displayName;
      console.log(`${displayName} connected (newuser event)`);
      io.to(GLOBAL_ROOM).emit('connected', { user: displayName, id: socket.id });
    });

    // Global chat room message handler
    socket.on('chat message', async (msg) => {
      const content = typeof msg === 'string' ? msg : msg?.message || msg?.content;
      if (!content) return;

      const timestamp = new Date();
      const payload = {
        room: GLOBAL_ROOM,
        roomType: 'global',
        user: displayName,
        from: connectedUser?._id,
        message: content,
        timestamp
      };
      console.log('Message received:', content);
      io.to(GLOBAL_ROOM).emit('chat message', payload); // Broadcast the message to all clients in global room

      await persistChatMessage({
        room: GLOBAL_ROOM,
        roomType: 'global',
        senderLabel: displayName,
        senderId: connectedUser?._id,
        content,
        timestamp
      });
    });

    // Join a direct-message room (two users)
    socket.on('join_direct', async (targetUserId) => {
      if (!connectedUser?._id || !targetUserId) {
        socket.emit('direct_error', 'Direct messages require authentication and a target user.');
        return;
      }

      if (String(targetUserId) === String(connectedUser._id)) {
        socket.emit('direct_error', 'Cannot start a direct chat with yourself.');
        return;
      }

      const room = getDirectRoom(connectedUser._id, targetUserId);
      if (!room) {
        socket.emit('direct_error', 'Invalid direct room');
        return;
      }

      socket.join(room);
      socket.emit('direct_room_joined', { room, with: targetUserId });
      await emitChatHistory(socket, room);
    });

    // Direct-message handler
    socket.on('direct_message', async (payload = {}) => {
      const { targetUserId, room, message, content } = payload || {};
      if (!connectedUser?._id) {
        socket.emit('direct_error', 'Authentication required for direct messages.');
        return;
      }

      const computedRoom = getDirectRoom(connectedUser._id, targetUserId);
      if (!computedRoom) {
        socket.emit('direct_error', 'Invalid target user for direct message.');
        return;
      }

      if (room && room !== computedRoom) {
        socket.emit('direct_error', 'Room does not match the participants.');
        return;
      }

      const rawContent = typeof message !== 'undefined' ? message : content;
      const text = typeof rawContent === 'string' ? rawContent : rawContent?.message || rawContent?.content;
      if (!text) return;

      const timestamp = new Date();
      const dmPayload = {
        room: computedRoom,
        roomType: 'direct',
        from: connectedUser._id,
        user: displayName,
        message: text,
        timestamp
      };
      console.log(`DM to ${computedRoom}:`, text);
      socket.join(computedRoom); // ensure sender is in the room
      const targetSockets = userSockets.get(String(targetUserId));
      if (targetSockets && targetSockets.size) {
        for (const s of targetSockets) {
          s.join(computedRoom);
        }
      }
      io.to(computedRoom).emit('direct_message', dmPayload);

      await persistChatMessage({
        room: computedRoom,
        roomType: 'direct',
        senderLabel: displayName,
        senderId: connectedUser._id,
        participantIds: [connectedUser._id, targetUserId],
        content: text,
        timestamp
      });
    });

    // Allow clients to request chat history on demand (global or direct)
    socket.on('get_chat_history', async (room = GLOBAL_ROOM) => {
      const resolvedRoom = room || GLOBAL_ROOM;
      const directParts = parseDirectRoom(resolvedRoom);
      if (directParts) {
        const userIdStr = connectedUser?._id?.toString();
        if (!userIdStr || !directParts.includes(userIdStr)) {
          socket.emit('direct_error', 'Not authorized for this direct room.');
          return;
        }
      }

      await emitChatHistory(socket, resolvedRoom);
    });
  });
};
