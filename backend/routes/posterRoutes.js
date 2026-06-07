import express from "express";
import rateLimit from "express-rate-limit";
import { generatePosterFromFrame } from "../controllers/posterController.js";

const router = express.Router();

const posterLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, error: "Too many poster generation requests. Please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/generate", posterLimiter, generatePosterFromFrame);

export default router;
