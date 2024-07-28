const { Server } = require('socket.io');
const Message = require('../models/messageModel');
const Group = require('../models/groupModel');
const crypto = require('crypto');
const ENC= 'bf3c199c2470cb477d907b1e0917c17b';
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

const decrypt = (text) => {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  let finalDecryptedText = decrypted + decipher.final('utf8');
  return finalDecryptedText;
}

exports.initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    },
  });

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    socket.on('join', ( user ) => {
      try {
        if (typeof user === 'string') {
          user = JSON.parse(user);
        }
        let { userId } = user;
        console.log(`User ${userId} joined with socket ID: ${socket.id}`);
        socket.join(userId);
      } catch (error) {
        console.error('Error joining room:', error);
      }
    });

    socket.on('sendPrivateMessage', async (data) => {
      try {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        const { senderId, receiverId, content, mediaUrl } = data;
        if (senderId && receiverId && content && mediaUrl) {
          const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                mediaUrl,
                privateChat: true,
              });
              await message.save();
              let decryptedMsg = decrypt(message.content);
              io.to(receiverId).emit('receiveMessage', {senderId, decryptedMsg});
        } else {
          console.log('Invalid message format:', data);
        }
      } catch (error) {
        console.log('Error processing sendPrivateMessage event:', error);
      }
    });

    socket.on('sendGroupMessage', async ( data ) => {
      try {
        if (typeof data === 'string') {
          data = JSON.parse(data);
        }
        const { senderId, groupId, content, mediaUrl } = data;
        if (senderId && groupId && content && mediaUrl) {
          const group = await Group.findById(groupId);
          const message = new Message({
            sender: senderId,
            groupId,
            content,
            mediaUrl,
            privateChat: false
          });
          await message.save();
          let decryptedMsg = decrypt(message.content);
          group.members.forEach(member => {
            if(member.toString() != senderId) {
              io.to(member.toString()).emit('receiveMessage', {senderId, decryptedMsg});
            }
          });
        } else {
          console.log('Invalid message format:', data);
        }
      } catch (error) {
        console.log('Error processing sendPrivateMessage event:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
