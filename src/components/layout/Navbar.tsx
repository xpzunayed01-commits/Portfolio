import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const links = [
    { name: 'Work', path: '/work' },
    { name: 'Services', path: '/services' },
    { name: 'Case Studies', path: '/case-studies' },
    { name: 'Certificates', path: '/certificates' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header 
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
        scrolled ? "bg-white/80 backdrop-blur-md border-gray-100 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-2.5 z-50 relative group"
          aria-label="Zunayed's Portfolio Home"
        >
          <img 
            src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
            alt="Zunayed's Portfolio" 
            className="h-8 md:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <span className="text-lg font-semibold tracking-tight text-graphite-900 hidden sm:inline-block">
            Zunayed's Portfolio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8 text-sm font-medium text-graphite-600">
            {links.map((link) => (
              <li key={link.name}>
                <Link 
                  to={link.path} 
                  className={cn(
                    "hover:text-graphite-900 transition-colors relative after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:bg-graphite-900 after:origin-left after:scale-x-0 hover:after:scale-x-100 after:transition-transform",
                    location.pathname === link.path && "text-graphite-900 after:scale-x-100"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link 
            to="/contact" 
            className="px-5 py-2.5 bg-graphite-900 text-white text-sm font-medium rounded-full hover:bg-graphite-800 transition-colors hover:scale-105 active:scale-95 duration-200"
          >
            Let's Work Together
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 relative p-2 -mr-2 text-graphite-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center pt-20 pb-6 px-6"
          >
            <ul className="flex flex-col items-center gap-8 text-2xl font-medium text-graphite-900">
              {links.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:opacity-70 transition-opacity">
                    {link.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/contact" className="hover:opacity-70 transition-opacity">
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
