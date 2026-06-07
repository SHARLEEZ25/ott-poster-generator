// src/components/common/ProjectCard.tsx
import React from 'react';
import { Heart, Eye } from 'lucide-react';
import { Project } from '../../api';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-700 transition-all">
      <div className="relative aspect-[2/3] overflow-hidden cursor-pointer">
        <img src={project.poster_url} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 p-4">
            <div className="flex gap-2 mb-2">
              <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded">{project.genre}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-300">
              <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{project.likes}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{project.views}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold truncate mb-1">{project.title}</h3>
        {project.tagline && <p className="text-gray-400 text-sm truncate">{project.tagline}</p>}
      </div>
    </div>
  );
}