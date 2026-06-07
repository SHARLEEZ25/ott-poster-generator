// src/pages/Projects.tsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Project } from '../api';
import ProjectCard from '../components/common/ProjectCard';

interface ProjectsProps {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setCurrentPage: (page: string) => void;
}

export default function Projects({ projects, setProjects, setCurrentPage }: ProjectsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [selectedPoster, setSelectedPoster] = useState<Project | null>(null); // modal state

  const filtered = projects.filter(p => {
    const matchesSearch = (p.title ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = genreFilter === 'all' || p.genre === genreFilter;
    return matchesSearch && matchesGenre;
  });

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">My Projects</h1>
            <p className="text-gray-400">{projects.length} cinematic posters created</p>
          </div>
          <button
            onClick={() => setCurrentPage('generator')}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Poster
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search posters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-700"
            />
          </div>
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white focus:outline-none focus:border-gray-700"
          >
            <option value="all">All Genres</option>
            <option value="Drama">Drama</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Horror">Horror</option>
          </select>
        </div>

        {/* Poster Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(project => (
            <div
              key={project.id}
              onClick={() => setSelectedPoster(project)}
              className="cursor-pointer"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedPoster && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="relative bg-gray-900 rounded-xl max-w-3xl w-full p-4 flex flex-col items-center">
            <button
              onClick={() => setSelectedPoster(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold"
            >
              ×
            </button>

            <img
              src={selectedPoster.poster_url}
              alt={selectedPoster.title}
              className="rounded-lg max-h-[80vh] w-auto object-contain"
            />

            <a
              href={selectedPoster.poster_url}
              download={`${selectedPoster.title.replace(/\s+/g, "_")}.png`}
              className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
