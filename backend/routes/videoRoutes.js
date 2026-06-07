import express from "express";
import multer from "multer";
import { uploadVideoAndExtractFrames } from "../controllers/videoController.js";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure upload folder exists
const uploadDir = path.join(path.resolve(), "seed", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "_" + file.originalname),
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("video/")) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed"));
    }
  },
});

// Route
router.post("/upload-video", upload.single("video"), uploadVideoAndExtractFrames);

export default router;
