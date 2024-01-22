import express from "express";
import { login, generateOTP } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", login);

router.post("/genOTP", generateOTP);

export default router;
