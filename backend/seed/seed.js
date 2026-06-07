import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "../models/Project.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB");
    await Project.deleteMany({});
    await Project.insertMany([
      {
        title: "Shadows of Tomorrow",
        genre: "Thriller",
        tagline: "Some secrets are meant to stay buried",
        poster_url: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop",
        created_at: new Date("2025-10-18T10:00:00Z"),
        likes: 24,
        views: 156,
        is_public: true,
        input_data: { mood: "Dark", modelPreset: "Photo-Real" },
      },
      {
        title: "காதல் கதை",
        genre: "Romance",
        tagline: "Love transcends all boundaries",
        language: "ta-IN",
        poster_url: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400&h=600&fit=crop",
        created_at: new Date("2025-10-17T14:30:00Z"),
        likes: 18,
        views: 92,
        is_public: true,
        input_data: { mood: "Dreamy", modelPreset: "Illustrated" },
      },
      {
        title: "The Last Stand",
        genre: "Drama",
        tagline: "When everything falls apart, courage rises",
        poster_url: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=400&h=600&fit=crop",
        created_at: new Date("2025-10-16T09:15:00Z"),
        likes: 31,
        views: 203,
        is_public: false,
        input_data: { mood: "Gritty", modelPreset: "3D-Cinematic" },
      },
      {
        title: "Night Whispers",
        genre: "Horror",
        tagline: "Silence can be deadly",
        poster_url: "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=400&h=600&fit=crop",
        created_at: new Date("2025-10-15T08:00:00Z"),
        likes: 45,
        views: 289,
        is_public: true,
        input_data: { mood: "Dark", modelPreset: "Photo-Real" },
      },
    ]);
    console.log("✅ Seeded posters!");
    mongoose.connection.close();
  })
  .catch((err) => console.error(err));
