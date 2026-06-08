import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";

dotenv.config();
const app = express();

app.use(helmet());
app.set("trust proxy", 1); // Render/Vercel sit behind a reverse proxy — this makes req.protocol return https

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:5173", "http://localhost:5174"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.some((o) => origin.startsWith(o))) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  allowedHeaders: ["Content-Type", "Authorization", "Accept", "Origin"],
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  optionsSuccessStatus: 204,
};

app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" }));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

import projectRoutes from "./routes/projects.js";
import posterRoutes from "./routes/posterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

app.use("/api/videos", videoRoutes);
app.use("/api/posters", posterRoutes);
app.use("/api/projects", projectRoutes);
app.use("/frames", express.static(path.join(process.cwd(), "frames"), {
  setHeaders: (res) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

app.get("/", (req, res) => res.send("Poster backend running 🚀"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
