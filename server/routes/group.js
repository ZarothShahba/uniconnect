import express from "express";
import { deleteGroupById, getGroups } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/getAll", getGroups);

/* DELETE */
router.delete("/delete/:groupId", verifyToken, deleteGroupById);

export default router;
