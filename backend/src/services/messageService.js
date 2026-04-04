const prisma = require('../config/prisma');

/**
 * Send a message
 */
const sendMessage = async (fromId, toId, content) => {
  const { type, text } = content;
  
  return await prisma.message.create({
    data: {
      fromId,
      toId,
      messageContent: {
        type: type || 'text',
        text
      }
    },
    include: {
      from: { select: { fullName: true } },
      to: { select: { fullName: true } }
    }
  });
};

/**
 * Get full conversation between two users
 */
const getConversation = async (user1Id, user2Id) => {
  return await prisma.message.findMany({
    where: {
      OR: [
        { fromId: user1Id, toId: user2Id },
        { fromId: user2Id, toId: user1Id }
      ]
    },
    orderBy: {
      createdAt: 'asc'
    },
    include: {
      from: { select: { id: true, fullName: true } }
    }
  });
};

/**
 * Get last message from each conversation (Inbox)
 */
const getChatList = async (userId) => {
  // Prisma MongoDB findMany combined with manual grouping since 
  // complex aggregation for "last message per user" is tricky in Prisma/Mongo.
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { fromId: userId },
        { toId: userId }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    include: {
      from: { select: { id: true, fullName: true } },
      to: { select: { id: true, fullName: true } }
    }
  });

  const chatMap = new Map();

  for (const msg of messages) {
    const partnerId = msg.fromId === userId ? msg.toId : msg.fromId;
    const partnerName = msg.fromId === userId ? msg.to.fullName : msg.from.fullName;
    
    if (!chatMap.has(partnerId)) {
      chatMap.set(partnerId, {
        partnerId,
        partnerName,
        lastMessage: msg.messageContent,
        createdAt: msg.createdAt
      });
    }
  }

  return Array.from(chatMap.values());
};

module.exports = {
  sendMessage,
  getConversation,
  getChatList
};
