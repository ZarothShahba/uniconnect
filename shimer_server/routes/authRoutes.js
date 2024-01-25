import express from "express";
import {
  createUser,
  loginUser,
  getMe,
  logout,
  updatePassword,
  forgotPassword,
  resetPassword,
  sendOtp,
  verifyOTP,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import fileUpload from "../middleware/fileUpload.js";

const router = express.Router();

router.post("/register", fileUpload, createUser);
router.post("/otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.put("/updatepassword", protect, updatePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resettoken", resetPassword);

export default router;
