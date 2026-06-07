import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String },
  tagline: { type: String },
  language: { type: String, default: "en" },
  poster_url: { type: String },
  created_at: { type: Date, default: Date.now },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  is_public: { type: Boolean, default: true },
  input_data: {
    mood: { type: String },
    modelPreset: { type: String },
  },
});

export default mongoose.model("Project", projectSchema);
