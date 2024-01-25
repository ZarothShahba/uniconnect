import { Router } from 'express';
import {
	getUsers,
	getUser,
	deleteUser,
} from '../controllers/userControllers.js';

import User from '../models/User.js';

const router = Router({ mergeParams: true });

import advancedResults from '../middleware/advancedResults.js';
import { protect, authorize } from '../middleware/auth.js';

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(advancedResults(User), getUsers);

router.route('/:id').get(getUser).delete(deleteUser);

export default router;
