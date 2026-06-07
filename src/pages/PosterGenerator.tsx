import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { User, Project, API_BASE } from '../api';



interface PosterGeneratorProps {
  user: User;
  setCurrentPage: (page: string) => void;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  selectedFrame: string | null;
  frameDescription: string | null;
}

export default function PosterGenerator({
  user,
  setCurrentPage,
  setProjects,
  selectedFrame,
  frameDescription
}: PosterGeneratorProps) {
  const [formData, setFormData] = useState({
    title: '',
    genre: 'Drama',
    tagline: '',
    mood: 'Dark',
    language: 'en',
    fontStyle: 'Cinematic',
    styleReference: '',
    modelPreset: 'Photo-Real',
    aspectRatio: '2:3'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [genError, setGenError] = useState<string | null>(null);
  const progressTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, []);

const handleGenerate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.title || formData.title.length < 2) {
    alert("Please enter a film title (at least 2 characters)");
    return;
  }

  if (!selectedFrame) {
    alert("No frame selected for poster generation");
    return;
  }

  setGenError(null);
  setIsGenerating(true);
  setProgress(0);

  // Fake progress bar
  progressTimerRef.current = window.setInterval(() => {
    setProgress(prev => (prev < 90 ? prev + 1 : prev));
  }, 150);


try {
  console.log("selectedFrame =", selectedFrame);

  const response = await fetch(`${API_BASE}/posters/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      framePath: selectedFrame,
      frameDescription: frameDescription,
      title: formData.title,
      genre: formData.genre,
      mood: formData.mood,
      tagline: formData.tagline,
      language: formData.language,
      fontStyle: formData.fontStyle,
      stylePreset: formData.modelPreset,
      aspectRatio: formData.aspectRatio,
      styleReference: formData.styleReference
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.poster) {
    throw new Error(data?.error || "Failed to generate poster");
  }

  // Save to database
  const saveRes = await fetch(`${API_BASE}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: formData.title,
      genre: formData.genre,
      tagline: formData.tagline,
      language: formData.language,
      poster_url: data.poster,
      is_public: true,
      input_data: {
        mood: formData.mood,
        modelPreset: formData.modelPreset,
      },
    }),
  });

  const savedProject: Project = await saveRes.json();
  setProjects(prev => [savedProject, ...prev]);
  setProgress(100);
  setIsGenerating(false);
  setCurrentPage("projects");

} catch (err) {
  console.error("❌ Error generating poster:", err);
  setGenError((err as Error).message || "Failed to generate poster");
  setIsGenerating(false);
} finally {
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
  }
};

  if (isGenerating) {
    return (
      <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center space-y-6">
            {genError && (
              <div className="bg-red-800 text-red-100 px-4 py-2 rounded-md mb-4">{genError}</div>
            )}
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Creating Your Poster</h3>
            <p className="text-gray-400">Generating cinematic artwork...</p>
            <div className="max-w-md mx-auto">
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-700 h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">{progress}%</p>
            </div>
            <p className="text-sm text-gray-500">This usually takes 10-15 seconds</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => setCurrentPage('dashboard')} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-bold text-white">AI Poster Generator</h1>
            <p className="text-gray-400 mt-1">Create cinematic posters in seconds</p>
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm text-gray-400">Quota</p>
            <p className="text-xl font-bold text-white">{user.quota_remaining} / 5</p>
          </div>
        </div>

        {selectedFrame && (
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 bg-[#1a1a2e] border border-indigo-700 rounded-full px-3 py-1 mb-3">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-300 text-xs font-medium">Gemini AI selected frame</span>
            </div>
            <img
              src={selectedFrame}
              alt="AI-selected Frame"
              className="mx-auto max-h-64 rounded-lg border border-indigo-700"
            />
            {frameDescription && (
              <p className="text-gray-500 text-xs mt-2 max-w-lg mx-auto italic">"{frameDescription}"</p>
            )}
          </div>
        )}

        <form onSubmit={handleGenerate} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          <div>
            <label className="block text-gray-400 mb-2">Film Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your film title"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:outline-none focus:border-gray-600"
              required
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Genre *</label>
              <select
                value={formData.genre}
                onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option>Drama</option>
                <option>Thriller</option>
                <option>Romance</option>
                <option>Horror</option>
                <option>Comedy</option>
                <option>Documentary</option>
                <option>Experimental</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Mood</label>
              <select
                value={formData.mood}
                onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option value="Dark">Dark & Moody</option>
                <option value="Dreamy">Dreamy & Ethereal</option>
                <option value="Vintage">Vintage & Classic</option>
                <option value="Futuristic">Futuristic & Modern</option>
                <option value="Minimal">Minimal & Clean</option>
                <option value="Retro">Retro & 80s</option>
                <option value="Gritty">Gritty & Raw</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Tagline</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g., One shot. One chance."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              maxLength={80}
            />
            <p className="text-xs text-gray-500 mt-1">Keep it short and impactful (max 80 characters)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option value="en">English</option>
                <option value="ta-IN">தமிழ் (Tamil)</option>
                <option value="te-IN">తెలుగు (Telugu)</option>
                <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                <option value="ml-IN">മലയാളം (Malayalam)</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Font Style</label>
              <select
                value={formData.fontStyle}
                onChange={(e) => setFormData({ ...formData, fontStyle: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option value="Cinematic">Cinematic (Bold & Dramatic)</option>
                <option value="Classic">Classic (Elegant Serif)</option>
                <option value="Tamil-Sans">Tamil-Sans (Regional)</option>
                <option value="Custom">Custom (AI Choice)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Style Preset</label>
              <select
                value={formData.modelPreset}
                onChange={(e) => setFormData({ ...formData, modelPreset: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option value="Photo-Real">Photo-Real</option>
                <option value="Illustrated">Illustrated</option>
                <option value="Retro-Poster">Retro Poster</option>
                <option value="3D-Cinematic">3D Cinematic</option>
                <option value="Minimal">Minimal</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Aspect Ratio</label>
              <select
                value={formData.aspectRatio}
                onChange={(e) => setFormData({ ...formData, aspectRatio: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600"
              >
                <option value="2:3">2:3 (Portrait Poster)</option>
                <option value="4:5">4:5 (Instagram)</option>
                <option value="16:9">16:9 (Landscape)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Style Reference (Optional)</label>
            <textarea
              value={formData.styleReference}
              onChange={(e) => setFormData({ ...formData, styleReference: e.target.value })}
              placeholder="e.g., 'Inception poster style', '80s Bollywood aesthetic', 'Film noir with red accents'"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-gray-600 h-24 resize-none"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">Describe visual style, color palette, or reference films</p>
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 font-medium disabled:opacity-50"
          >
            <Sparkles className="w-5 h-5" />
            Generate Poster
          </button>
        </form>
      </div>
    </div>
  );
}
