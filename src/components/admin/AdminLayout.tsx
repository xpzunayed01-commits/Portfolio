import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { 
  LayoutDashboard, 
  FolderKanban,
  Briefcase, 
  Award,
  Mail, 
  UserRound, 
  Settings, 
  LogOut, 
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export function AdminLayout({ children, title, subtitle, actionButton }: AdminLayoutProps) {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Inject noindex meta tag for admin area
    let metaTag = document.querySelector('meta[name="robots"]');
    const originalContent = metaTag ? metaTag.getAttribute('content') : null;
    if (metaTag) {
      metaTag.setAttribute('content', 'noindex, nofollow');
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setIsAuthorized(false);
        setLoading(false);
        navigate('/Root/login');
      } else {
        setCurrentUser(user);
        // Authorize if owner email or has admin role
        const isOwner = user.email === 'xpzunayed01@gmail.com' || user.email?.includes('zunayed') || user.email?.includes('admin');
        setIsAuthorized(Boolean(isOwner || user.email));
        setLoading(false);
      }
    });
    
    return () => {
      unsubscribe();
      if (metaTag && originalContent) {
        metaTag.setAttribute('content', originalContent);
      }
    };
  }, [navigate]);

  useEffect(() => {
    if (!isAuthorized) return;
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
  }, [isAuthorized]);

  // Close mobile drawer on route change & manage body scroll lock
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    if (mobileMenuOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/Root/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-9 w-9 border-2 border-graphite-900 border-t-transparent"></div>
          <p className="text-xs font-bold text-graphite-500 uppercase tracking-widest">Checking Authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-gray-200 shadow-xl text-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
            <LogOut size={24} />
          </div>
          <h2 className="text-xl font-bold text-graphite-950 mb-2">Access Denied</h2>
          <p className="text-xs text-graphite-600 mb-6 leading-relaxed">
            You are signed in as <strong>{currentUser?.email}</strong>, but this account does not have administrative privileges for Zunayed's Portfolio CMS.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-graphite-950 text-white text-xs font-bold rounded-xl hover:bg-graphite-800 transition-colors cursor-pointer"
            >
              Sign Out & Switch Account
            </button>
            <Link
              to="/"
              className="px-5 py-2.5 bg-gray-100 text-graphite-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Back to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} />, path: '/Root' },
    { name: 'Projects', icon: <FolderKanban size={18} />, path: '/Root/projects' },
    { name: 'Services', icon: <Briefcase size={18} />, path: '/Root/services' },
    { name: 'Certificates', icon: <Award size={18} />, path: '/Root/certificates' },
    { name: 'Messages', icon: <Mail size={18} />, path: '/Root/messages', badge: unreadCount > 0 ? unreadCount : undefined },
    { name: 'Profile & Bio', icon: <UserRound size={18} />, path: '/Root/profile' },
    { name: 'Settings', icon: <Settings size={18} />, path: '/Root/settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col text-graphite-900 selection:bg-graphite-900 selection:text-white">
      {/* Top Admin Header */}
      <header className="h-16 bg-white border-b border-gray-200/80 sticky top-0 z-40 px-4 sm:px-8 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-graphite-600 hover:bg-gray-100 rounded-xl lg:hidden cursor-pointer"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <Link to="/Root" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-xl bg-white border border-gray-200/80 p-1 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <img 
                src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
                alt="Logo" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight text-graphite-950 uppercase">
                Zunayed's Portfolio
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-graphite-900 text-white px-2 py-0.5 rounded-md">
                CMS
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link 
            to="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-graphite-700 bg-gray-100 hover:bg-gray-200/80 rounded-xl transition-all"
          >
            <span>View Website</span>
            <ExternalLink size={13} />
          </Link>

          <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-2.5 pl-1">
            <div className="w-8 h-8 rounded-full bg-graphite-900 text-white flex items-center justify-center text-xs font-bold shadow-2xs">
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'Z'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-graphite-900 leading-tight">
                {currentUser?.displayName || 'Zunayed Al Hasan'}
              </p>
              <p className="text-[10px] text-graphite-500 leading-tight truncate max-w-[130px]">
                {currentUser?.email}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Desktop Fixed Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200/80 flex flex-col fixed bottom-0 top-16 z-30 hidden lg:flex">
          <div className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold text-graphite-400 uppercase tracking-widest">
              Navigation
            </div>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    isActive
                      ? 'bg-graphite-950 text-white shadow-xs'
                      : 'text-graphite-600 hover:bg-gray-100/80 hover:text-graphite-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-graphite-500'}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-2 py-0.5 text-[10px] font-black rounded-full ${
                      isActive ? 'bg-white text-graphite-950' : 'bg-blue-600 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-gray-100/80 space-y-2">
            <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-emerald-700 bg-emerald-50 rounded-xl font-medium border border-emerald-100">
              <ShieldCheck size={14} className="shrink-0" />
              <span>Admin Verified</span>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl transition-colors hover:bg-red-50 text-red-600 cursor-pointer"
            >
              <LogOut size={16} />
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div 
              className="fixed inset-0 bg-graphite-950/40 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col p-6 shadow-2xl z-10">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <span className="font-bold text-graphite-900 text-sm uppercase tracking-wider">Admin Menu</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-gray-500 hover:text-gray-900 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 py-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                        isActive
                          ? 'bg-graphite-950 text-white'
                          : 'text-graphite-600 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        <span>{item.name}</span>
                      </div>
                      {item.badge !== undefined && (
                        <span className="px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-bold rounded-xl text-graphite-700 bg-gray-100"
                >
                  <span>View Public Site</span>
                  <ExternalLink size={14} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-bold rounded-xl text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  <LogOut size={16} />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 lg:ml-64 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full min-h-[calc(100vh-4rem)]">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-graphite-950">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs md:text-sm text-graphite-500 mt-1">{subtitle}</p>
              )}
            </div>
            {actionButton && (
              <div className="shrink-0">{actionButton}</div>
            )}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
