// src/pages/Dashboard.tsx
import React from 'react';
import { Sparkles, ArrowLeft, Image, TrendingUp, Target, Trophy } from 'lucide-react';
import { User, Project } from '../api';
import StatCard from '../components/common/StatCard';

interface DashboardProps {
  user: User;
  projects: Project[];
  setCurrentPage: (page: string) => void;
}

export default function Dashboard({ user, projects, setCurrentPage }: DashboardProps) {
  const thisMonth = projects.filter(p => {
    const date = new Date(p.created_date);
    const now = new Date();
    // Simple check: assumes created_date is a valid date string
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  const totalViews = projects.reduce((sum, p) => sum + p.views, 0);
  const totalLikes = projects.reduce((sum, p) => sum + p.likes, 0);

  return (
    <div className="px-4 lg:px-8 pt-8 lg:pt-12 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
          <div>
            <p className="text-red-500 font-medium mb-2">Good Evening</p>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3">
              {user.full_name.split(' ')[0]}'s Studio
            </h1>
            <p className="text-gray-400 text-lg">Create stunning cinematic posters with AI magic</p>
          </div>
          
          <button
            onClick={() => setCurrentPage('upload')}
            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-lg flex items-center gap-2 shadow-lg shadow-red-600/20"
          >
            <Sparkles className="w-5 h-5" />
            Create Poster
            <ArrowLeft className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <StatCard title="Total Posters" value={projects.length} icon={Image} gradient="from-blue-600 to-blue-700" />
          <StatCard title="This Month" value={thisMonth} icon={TrendingUp} gradient="from-green-600 to-green-700" trend="+12%" />
          <StatCard title="Total Views" value={totalViews} icon={Target} gradient="from-purple-600 to-purple-700" />
          <StatCard title="Total Likes" value={totalLikes} icon={Trophy} gradient="from-orange-600 to-orange-700" />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-xl">Recent Projects</h2>
            <button
              onClick={() => setCurrentPage('projects')}
              className="text-sm text-gray-400 hover:text-white"
            >
              View All
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {projects.slice(0, 4).map(project => (
              <div key={project.id} className="group relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer">
                <img src={project.poster_url} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 p-3">
                    <h4 className="text-white font-semibold text-sm truncate">{project.title}</h4>
                    <p className="text-gray-300 text-xs">{project.genre}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
