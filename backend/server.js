import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";


dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:5173",
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

import projectRoutes from "./routes/projects.js";
import posterRoutes from "./routes/posterRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";

app.use('/api/videos', videoRoutes);
app.use('/api/posters', posterRoutes);        
app.use('/api/projects', projectRoutes);     
app.use("/frames", express.static(path.join(process.cwd(), "frames")));



app.get("/", (req, res) => res.send("Poster backend running 🚀"));


app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
