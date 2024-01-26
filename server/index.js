import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import groupRoutes from "./routes/group.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { updateProfile } from "./controllers/users.js";
import { verifyToken } from "./middleware/auth.js";
import { createGroup } from "./controllers/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";
import chatRoute from "./routes/chatRoute.js";
import messageRoute from "./routes/messageRoute.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
// app.use(morgan("common"));
app.use(bodyParser.json({ limit: "150mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/public", express.static(path.join(__dirname, "public")));

const upload = multer({
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      if (file.fieldname === "picture") {
        cb(null, "public/assets/picture");
      } else if (file.fieldname === "video") {
        cb(null, "public/assets/videos");
      }
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
  fileFilter: function (req, file, cb) {
    const allowedFileTypes = /jpeg|jpg|png|mp4/;
    const isAllowed = allowedFileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (isAllowed) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPEG, JPG, PNG, and MP4 files are allowed."
        )
      );
    }
  },
}).fields([
  { name: "picture", maxCount: 1 },
  { name: "video", maxCount: 1 },
]);

/* ROUTES WITH FILES */
app.post("/auth/register", upload, register);
app.post("/posts/create", verifyToken, upload, createPost);
app.put("/users/:id/update-profile", verifyToken, upload, updateProfile);
app.post("/group/create", verifyToken, upload, createGroup);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/groups", groupRoutes);

// Chat Routes
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
  })
  .catch((error) => console.log(`${error} did not connect`));
