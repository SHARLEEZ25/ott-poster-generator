import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { uploadVideoAndExtractFrames } from "../controllers/videoController.js";
import path from "path";
import fs from "fs";

const router = express.Router();

const uploadDir = path.join(path.resolve(), "seed", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many uploads. Please wait before trying again." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/upload-video", uploadLimiter, upload.single("video"), uploadVideoAndExtractFrames);

export default router;
