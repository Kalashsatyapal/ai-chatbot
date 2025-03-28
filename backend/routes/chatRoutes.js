import express from 'express';
import { sendMessage, startNewChat, getUserChats, getChatMessages } from '../controllers/chatController.js';

const router = express.Router();

router.post('/new', startNewChat);
router.post('/message', sendMessage);
router.get('/history/:user_id', getUserChats);
router.get('/messages/:chat_id', getChatMessages);

export default router;
