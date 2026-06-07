// src/api.ts
import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react'; 

export const API_BASE = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "http://localhost:5000/api";



export interface User {
  id: string;
  full_name: string;
  email: string;
  role: string;
  quota_remaining: number;
  poster_count: number;
  language: string;
  font_preference: string;
}

export interface Project {
  id: string;
  title: string;
  genre: string;
  tagline: string;
  language: string;
  poster_url: string;
  created_date: string;
  likes: number;
  views: number;
  is_public: boolean;
  input_data: {
    mood?: string;
    modelPreset?: string;
    [key: string]: string | undefined;
  };
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  gradient: string;
  trend?: string;
}


export interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
    highlight?: boolean;
}



export const mockUser: User = {
  id: '1',
  full_name: 'Demo User',
  email: 'demo@example.com',
  role: 'creator',
  quota_remaining: 5,
  poster_count: 12,
  language: 'en',
  font_preference: 'Cinematic'
};