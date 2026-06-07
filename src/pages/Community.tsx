// src/pages/Community.tsx
import React from 'react';
import { Sparkles } from 'lucide-react';
import { Project } from '../api';
import ProjectCard from '../components/common/ProjectCard';

interface CommunityProps {
  projects: Project[];
  setCurrentPage: (page: string) => void;
}

export default function Community({ projects, setCurrentPage }: CommunityProps) {
  const publicProjects = projects.filter(p => p.is_public);

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">Community Gallery</h1>
          <p className="text-gray-400 text-lg">Discover amazing posters created by our community</p>
        </div>

        {publicProjects.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No public posters yet</h3>
            <p className="text-gray-400">Be the first to share your creation!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {publicProjects.map(project => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}