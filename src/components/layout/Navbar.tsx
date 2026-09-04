import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Sparkles, PhoneCall } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { profile } = usePortfolioData();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Handle ESC key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Manage body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { name: 'Work', path: '/work' },
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'CV / Resume', path: '/cv' },
    { name: 'About', path: '/about' },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b",
          scrolled || isOpen
            ? "bg-white/95 backdrop-blur-md border-gray-200/80 py-3 sm:py-3.5 shadow-2xs" 
            : "bg-[#FAF9F6]/90 backdrop-blur-sm border-transparent py-4 sm:py-5"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          <Link 
            to="/" 
            onClick={closeMenu}
            className="flex items-center gap-2.5 z-50 relative group py-1"
            aria-label="Zunayed's Portfolio Home"
          >
            <img 
              src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
              alt="Zunayed's Portfolio" 
              className="h-7 sm:h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-graphite-950 leading-tight">
                {profile.name || "Zunayed Al Hasan"}
              </span>
              <span className="text-[10px] font-bold text-graphite-500 uppercase tracking-widest hidden xs:block">
                Portfolio
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            <ul className="flex items-center gap-6 text-xs xl:text-sm font-semibold text-graphite-600">
              {links.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path} 
                    className={cn(
                      "hover:text-graphite-950 transition-colors relative py-1 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-graphite-950 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                      location.pathname === link.path && "text-graphite-950 font-bold after:scale-x-100"
                    )}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            <Link 
              to="/contact" 
              className="px-5 py-2.5 bg-graphite-950 text-white text-xs font-bold rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 duration-200 shadow-xs cursor-pointer"
            >
              Let's Work Together
            </Link>
          </nav>

          {/* Mobile / Tablet Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link 
              to="/contact"
              onClick={closeMenu}
              className="hidden sm:inline-flex px-3.5 py-1.5 bg-graphite-950 text-white text-xs font-bold rounded-full hover:bg-graphite-800 transition-all shadow-xs"
            >
              Let's Talk
            </Link>

            {/* Mobile Menu Toggle Button */}
            <button 
              type="button"
              className="relative p-2.5 -mr-1.5 text-graphite-950 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all cursor-pointer touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center border border-gray-200/60 bg-white/60 shadow-2xs"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X size={22} className="text-graphite-950 transition-transform duration-200 rotate-0" />
              ) : (
                <div className="flex flex-col gap-1.2 items-center justify-center w-5">
                  <span className="w-5 h-0.5 bg-graphite-950 rounded-full transition-all"></span>
                  <span className="w-5 h-0.5 bg-graphite-950 rounded-full transition-all"></span>
                  <span className="w-3.5 h-0.5 bg-graphite-950 rounded-full self-start transition-all"></span>
                </div>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Drawer */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex flex-col pt-[58px] sm:pt-[66px]">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-graphite-950/30 backdrop-blur-xs"
              onClick={closeMenu}
            />

            {/* Drawer Content */}
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="relative flex-1 bg-white border-t border-gray-200 shadow-2xl flex flex-col justify-between overflow-y-auto z-10"
            >
              <div className="p-5 sm:p-7 space-y-6">
                <div>
                  <p className="text-[11px] font-bold text-graphite-400 uppercase tracking-widest px-2 mb-3">
                    Menu Navigation
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {links.map((link, idx) => {
                      const isActive = location.pathname === link.path;
                      return (
                        <motion.li 
                          key={link.name}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.035 }}
                        >
                          <Link 
                            to={link.path} 
                            onClick={closeMenu}
                            className={cn(
                              "flex items-center justify-between py-3.5 px-4 rounded-xl text-base sm:text-lg font-bold transition-all min-h-[48px] active:scale-[0.99]",
                              isActive 
                                ? "bg-graphite-950 text-white shadow-xs" 
                                : "text-graphite-800 hover:bg-gray-100/90 active:bg-gray-100"
                            )}
                          >
                            <span>{link.name}</span>
                            <ArrowRight size={18} className={isActive ? "text-white" : "text-gray-400"} />
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="p-5 sm:p-7 bg-[#FAF9F6] border-t border-gray-100 space-y-3 mt-auto">
                <Link 
                  to="/contact" 
                  onClick={closeMenu}
                  className="w-full py-3.5 sm:py-4 bg-graphite-950 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 hover:bg-graphite-800 active:scale-[0.98] transition-all shadow-md min-h-[48px]"
                >
                  <span>Let's Work Together</span>
                  <Sparkles size={16} />
                </Link>

                <div className="text-center pt-1">
                  <p className="text-xs text-graphite-600 font-medium">
                    {profile.availabilityStatus || 'Available for Freelance Projects'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
