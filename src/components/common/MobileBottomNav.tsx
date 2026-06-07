// src/components/common/MobileBottomNav.tsx
import React from 'react';
import { LayoutDashboard, FolderOpen, Sparkles, Settings as SettingsIcon } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export default function MobileBottomNav({ currentPage, setCurrentPage }: MobileBottomNavProps) {
  const items = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'generator', label: 'Create', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-gray-800">
      <nav className="flex items-center justify-around px-2 py-2">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
              currentPage === item.id ? 'text-red-600' : 'text-gray-400'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}