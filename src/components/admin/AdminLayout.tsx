import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  Briefcase, 
  FileText, 
  Layers, 
  Mail, 
  User, 
  ExternalLink,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  actionButton?: React.ReactNode;
}

export function AdminLayout({ children, title, actionButton }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/Root/login');
      } else {
        setCurrentUser(user);
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Listen for unread messages count
    try {
      const q = query(collection(db, 'contactMessages'), where('status', '==', 'unread'));
      const unsub = onSnapshot(q, (snap) => {
        setUnreadCount(snap.size);
      }, () => {
        setUnreadCount(0);
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/Root/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-graphite-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-graphite-500">Checking authorization...</p>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/Root' },
    { name: 'Projects', icon: <Briefcase size={18} />, path: '/Root/projects' },
    { name: 'Services', icon: <Layers size={18} />, path: '/Root/services' },
    { name: 'Certificates', icon: <FileText size={18} />, path: '/Root/certificates' },
    { name: 'Messages', icon: <Mail size={18} />, path: '/Root/messages', badge: unreadCount > 0 ? unreadCount : undefined },
    { name: 'Profile & Bio', icon: <User size={18} />, path: '/Root/profile' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/Root/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-gray-200/80 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-graphite-600 hover:bg-gray-100 rounded-lg lg:hidden"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/Root" className="flex items-center gap-2.5">
            <img 
              src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
              alt="Logo" 
              className="h-7 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-bold tracking-tight text-graphite-900 uppercase">
              Admin Portal
            </span>
            <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest bg-graphite-900 text-white px-2 py-0.5 rounded">
              PROD
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-graphite-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink size={14} />
          </Link>

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-2 pl-1">
            <div className="w-8 h-8 rounded-full bg-graphite-900 text-white flex items-center justify-center text-xs font-bold">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-graphite-900 leading-tight">
                {currentUser?.displayName || 'Zunayed Al Hasan'}
              </p>
              <p className="text-[10px] text-graphite-500 leading-tight truncate max-w-[140px]">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar for Desktop */}
        <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col fixed bottom-0 top-16 z-30 hidden lg:flex">
          <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold text-graphite-400 uppercase tracking-wider">
              Management
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? 'bg-graphite-900 text-white shadow-sm'
                      : 'text-graphite-600 hover:bg-gray-100/80 hover:text-graphite-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                      isActive ? 'bg-white text-graphite-900' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors hover:bg-red-50 text-red-600"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-graphite-900/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col p-6 shadow-2xl z-10">
              <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                <span className="font-bold text-graphite-900">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-500">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? 'bg-graphite-900 text-white'
                          : 'text-graphite-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-red-500 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl text-red-600 hover:bg-red-50"
                >
                  <LogOut size={18} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-10 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-graphite-900">
                {title}
              </h1>
            </div>
            {actionButton && (
              <div>{actionButton}</div>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
