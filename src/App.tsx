import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom';

import {
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Settings as SettingsIcon,
  Users,
  BookOpen,
  UploadCloud
} from 'lucide-react';

import { API_BASE, User, Project, mockUser } from './api';

// Common Components
import Sidebar from './components/common/Sidebar';
import MobileHeader from './components/common/MobileHeader';
import MobileBottomNav from './components/common/MobileBottomNav';

// Pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import PosterGenerator from './pages/PosterGenerator';
import Community from './pages/Community';
import Learn from './pages/Learn';
import Settings from './pages/Settings';
import Upload from './pages/Upload';
import AssetDesktop from './pages/Assets';


// INNER APP CONTENT WRAPPED BY ROUTER
function PosterAIAppContent() {
  const [user, setUser] = useState<User>(mockUser);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);

  const currentPage = location.pathname.substring(1).split('/')[0] || 'dashboard';

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const res = await fetch(`${API_BASE}/projects`);
        if (!res.ok) return;
        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadProjects();
  }, []);

  const setCurrentPage = (page: string) => {
    navigate(page === 'dashboard' ? '/' : `/${page}`);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'upload', label: 'Upload Content', icon: UploadCloud },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'generator', label: 'AI Generator', icon: Sparkles, highlight: true },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#0F0F0F] to-[#1A0A0A]">
      
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        navItems={navItems}
      />

      <MobileHeader
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        navItems={navItems}
      />

      <main className="lg:ml-64 pt-16 lg:pt-0 pb-20 lg:pb-0">
        <Routes>

          <Route
            path="/"
            element={<Dashboard user={user} projects={projects} setCurrentPage={setCurrentPage} />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard user={user} projects={projects} setCurrentPage={setCurrentPage} />}
          />

          <Route
            path="/projects"
            element={<Projects projects={projects} setProjects={setProjects} setCurrentPage={setCurrentPage} />}
          />

          <Route
            path="/upload"
            element={
              <Upload
                onFrameSelect={(frameUrl: string) => {
                  setSelectedFrame(frameUrl);
                }}
              />
            }
          />

          <Route
            path="/generator"
            element={
              <PosterGenerator
                user={user}
                selectedFrame={selectedFrame}
                setCurrentPage={setCurrentPage}
                setProjects={setProjects}
              />
            }
          />

          <Route
            path="/community"
            element={<Community projects={projects} setCurrentPage={setCurrentPage} />}
          />

          <Route path="/learn" element={<Learn />} />

          <Route
            path="/settings"
            element={<Settings user={user} setUser={setUser} />}
          />

          <Route path="/asset-desktop" element={<AssetDesktop />} />

          <Route path="*" element={<div className="p-8 text-white">404 - Page Not Found</div>} />

        </Routes>
      </main>

      <MobileBottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default function PosterAIApp() {
  return (
    <BrowserRouter>
      <PosterAIAppContent />
    </BrowserRouter>
  );
}
