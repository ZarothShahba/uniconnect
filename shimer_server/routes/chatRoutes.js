import express from 'express';
import { protect } from '../middleware/auth.js';
import {
	createMessage,
	findOrCreateChat,
	getUserConversations,
	loadMoreMessages,
} from '../controllers/chatController.js';

const router = express.Router();

router.use(protect);

router.get('/', getUserConversations).post('/', findOrCreateChat);
router.get('/:conversationId', loadMoreMessages);
router.post('/message', createMessage);

export default router;
