// src/components/common/Sidebar.tsx
import React from 'react';
import { NavItem } from '../../api';

interface SidebarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navItems: NavItem[];
}

export default function Sidebar({ currentPage, setCurrentPage, navItems }: SidebarProps) {
  return (
    <aside className="hidden lg:block fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-gray-800 z-40">
      <div className="flex flex-col h-full p-6">
        <div className="flex items-center gap-3 mb-8">
          <div>
            <h2 className="font-bold text-white text-lg">OTT<span className="text-red-500">Poster</span></h2>
            <p className="text-xs text-gray-400">AI Generator</p>
          </div>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                currentPage === item.id
                  ? item.highlight
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20'
                    : 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-800">
          <p className="text-xs text-gray-500 text-center">Cinematic AI Posters</p>
        </div>
      </div>
    </aside>
  );
}