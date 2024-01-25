import express from "express"
import {createUser, loginUser, getMe, logout, updatePassword, forgotPassword, resetPassword} from "../controllers/authController.js"
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/updatepassword', protect, updatePassword);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);

export default router;