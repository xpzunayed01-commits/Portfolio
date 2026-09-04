import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export function Work() {
  const { projects } = usePortfolioData();
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();
  
  const categories = ['All', ...new Set(projects.map(p => p.category))];
  
  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 mb-3 sm:mb-6"
        >
          Selected Work
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-graphite-600 max-w-2xl mb-8 sm:mb-12"
        >
          An archive of digital experiences, interfaces, and identities built with intention.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 sm:px-5 sm:py-2.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation ${
                filter === cat 
                  ? 'bg-graphite-900 text-white shadow-md' 
                  : 'bg-white text-graphite-600 border border-gray-200 hover:border-graphite-900 hover:text-graphite-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-x-8 lg:gap-x-12 gap-y-10 sm:gap-y-16">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.div
                layout
                key={project.id || project.slug}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
                onClick={() => navigate(`/work/${project.slug}`)}
              >
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 relative border border-gray-100 shadow-xs">
                  <img 
                    src={project.coverImage} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-graphite-900/0 group-hover:bg-graphite-900/10 transition-colors duration-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3">
                    <span className="text-[11px] sm:text-xs font-bold text-graphite-500 uppercase tracking-widest">{project.category}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-[11px] sm:text-xs font-medium text-graphite-400">{project.year}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-graphite-900 mb-2 group-hover:underline underline-offset-4 decoration-2">{project.title}</h3>
                  <p className="text-graphite-600 text-balance line-clamp-2 text-xs sm:text-sm">{project.shortDescription}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        {filteredProjects.length === 0 && (
          <div className="py-20 text-center text-graphite-500 text-sm">
            No projects found in this category.
          </div>
        )}
      </div>
    </div>
  );
}
