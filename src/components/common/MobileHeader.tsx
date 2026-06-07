// src/components/common/MobileHeader.tsx
import React from 'react';
import { Menu } from 'lucide-react';
import { NavItem } from '../../api';

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  navItems: NavItem[];
}

export default function MobileHeader({ mobileMenuOpen, setMobileMenuOpen, currentPage, setCurrentPage, navItems }: MobileHeaderProps) {
  return (
    <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800">
      <div className="flex items-center justify-between px-4 py-3">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
          <Menu className="w-6 h-6" />
        </button>
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">OTT<span className="text-red-500">Poster</span></span>
        </div>
        
        <div className="w-6" />
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black border-b border-gray-800 p-4">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentPage(item.id);
                // setMobileMenuOpen(false) is handled in App.tsx's setCurrentPage
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 ${
                currentPage === item.id ? 'bg-gray-800 text-white' : 'text-gray-400'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}