import express from "express";
import {
  deleteGroupById,
  getGroupPosts,
  getGroups,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET */
router.get("/getAll", getGroups);

/* DELETE */
router.delete("/delete/:groupId", verifyToken, deleteGroupById);

router.get("/:groupId/posts", verifyToken, getGroupPosts);

export default router;
