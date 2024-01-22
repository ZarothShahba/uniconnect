import express from "express";
import {
  deleteProfile,
  getUser,
  getAllUsers,
  updateProfile,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* GET ALL USERS */
router.get("/getAll", getAllUsers);

/* READ */
router.get("/:id", verifyToken, getUser);

/* UPDATE */
// router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
// router.put("/:id/update-profile", verifyToken, updateProfile);

/* DELETE */
router.delete("/:id/delete", verifyToken, deleteProfile);

export default router;
