const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

router.get('/', messageController.getChatList);
router.get('/:userID', messageController.getConversation);
router.post('/', messageController.sendMessage);

module.exports = router;
