import Project from "../models/Project.js";

// Helper: map mongoose doc to frontend-friendly shape
const mapProject = (p) => ({
  id: p._id ? p._id.toString() : undefined,
  title: p.title,
  genre: p.genre,
  tagline: p.tagline,
  language: p.language,
  poster_url: p.poster_url,
  created_date: p.created_at || p.created_date || new Date(),
  likes: p.likes || 0,
  views: p.views || 0,
  is_public: p.is_public,
  input_data: p.input_data || {},
});

// GET all projects (returns mapped shape expected by frontend)
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ created_at: -1 });
    const mapped = projects.map(mapProject);
    res.json(mapped);
  } catch (error) {
    console.error("getProjects error:", error);
    res.status(500).json({ message: "Error fetching projects" });
  }
};

// POST new project (persist and return mapped)
export const createProject = async (req, res) => {
  try {
    const { title, genre, tagline, language, poster_url, input_data, is_public } = req.body;

    if (!title || typeof title !== "string" || title.trim().length < 2) {
      return res.status(400).json({ message: "title is required (min 2 characters)" });
    }

    const newProject = await Project.create({
      title: title.trim(),
      genre,
      tagline,
      language,
      poster_url,
      input_data,
      is_public: is_public ?? true,
    });
    res.status(201).json(mapProject(newProject));
  } catch (error) {
    console.error("createProject error:", error);
    res.status(500).json({ message: "Error creating project" });
  }
};
