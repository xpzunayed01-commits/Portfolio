import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { LayoutDashboard, LogOut, Settings, Image as ImageIcon, Briefcase, FileText, Layers, Mail, User } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/Root/login');
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/Root/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-graphite-900"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/Root' },
    { name: 'Projects', icon: <Briefcase size={20} />, path: '/Root/projects' },
    { name: 'Services', icon: <Layers size={20} />, path: '/Root/services' },
    { name: 'Certificates', icon: <FileText size={20} />, path: '/Root/certificates' },
    { name: 'Messages', icon: <Mail size={20} />, path: '/Root/messages' },
    { name: 'Profile', icon: <User size={20} />, path: '/Root/profile' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/Root/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex pt-20">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed inset-y-0 pt-20 pb-8 z-40 hidden lg:flex shadow-sm">
        <div className="flex-grow px-6 pt-8">
          <ul className="space-y-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                      isActive 
                        ? 'bg-graphite-900 text-white shadow-md shadow-graphite-900/10' 
                        : 'text-graphite-600 hover:bg-gray-50 hover:text-graphite-900'
                    }`}
                  >
                    {item.icon} {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="px-6 pt-6 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-colors hover:bg-red-50 text-red-600 focus:outline-none"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <h1 className="text-3xl font-semibold text-graphite-900">{title}</h1>
            <Link to="/" className="text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors">
              View Website
            </Link>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
}
