const messageService = require('../services/messageService');

const sendMessage = async (req, res) => {
  try {
    const fromId = req.user.userId;
    
    if (!req.body) {
      return res.status(400).json({ message: 'Request body is missing. Ensure you send JSON with Content-Type: application/json' });
    }

    const { to: toId, messageContent } = req.body;
    
    if (!toId || !messageContent || !messageContent.text) {
      return res.status(400).json({ message: 'Missing recipient ID or message content' });
    }

    const message = await messageService.sendMessage(fromId, toId, messageContent);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  try {
    const currentUserId = req.user.userId;
    const otherUserId = req.params.userID;
    
    const conversation = await messageService.getConversation(currentUserId, otherUserId);
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getChatList = async (req, res) => {
  try {
    const userId = req.user.userId;
    const chatList = await messageService.getChatList(userId);
    res.status(200).json(chatList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getChatList
};
