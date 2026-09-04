import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fallbackProjects } from '@/data';
import { Project } from '@/types';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = fallbackProjects.find(p => p.slug === slug);
    if (p) setProject(p);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Case Study Not Found</h2>
          <Link to="/case-studies" className="text-graphite-600 hover:text-graphite-900 underline underline-offset-4">Back to Case Studies</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-16">
        <Link to="/case-studies" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors mb-6 sm:mb-12">
          <ArrowLeft size={16} /> Back to Case Studies
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-4 sm:mb-6">
            <span className="px-3 py-1 bg-graphite-100 text-graphite-700 text-[11px] sm:text-xs font-bold uppercase tracking-widest rounded-md border border-gray-200">
              {project.category}
            </span>
            <span className="text-graphite-400 font-medium text-xs sm:text-sm">{project.year}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-graphite-900 mb-6 sm:mb-8 leading-tight">
            {project.title}
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-20"
      >
        <div className="w-full aspect-video sm:aspect-[21/9] bg-gray-100 rounded-2xl sm:rounded-[2rem] overflow-hidden border border-gray-100 shadow-2xs">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 prose prose-base sm:prose-lg prose-graphite text-graphite-600">
        {project.overview && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">1. Overview</h2>
            <p className="text-sm sm:text-base leading-relaxed">{project.overview}</p>
          </section>
        )}

        {project.problem && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">2. The Challenge</h2>
            <p className="text-sm sm:text-base leading-relaxed">{project.problem}</p>
          </section>
        )}

        {project.goal && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">3. Goal</h2>
            <p className="text-sm sm:text-base leading-relaxed">{project.goal}</p>
          </section>
        )}

        {project.process && (
          <section className="mb-10 sm:mb-16">
            <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">4. Process & Design</h2>
            <p className="text-sm sm:text-base leading-relaxed">{project.process}</p>
          </section>
        )}

        <section className="mb-10 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">Technologies & Role</h2>
          <ul className="list-disc pl-5 text-sm sm:text-base space-y-1">
            <li><strong>Role:</strong> {project.role || 'Lead Designer & Developer'}</li>
            <li><strong>Tools:</strong> {project.technologies.join(', ')}</li>
          </ul>
        </section>

        {project.liveUrl && project.liveUrl !== '#' && (
          <div className="pt-6 sm:pt-8 mb-12 sm:mb-16 border-t border-gray-100">
            <a 
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-graphite-900 text-white font-bold text-xs sm:text-sm rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95"
            >
              View Final Result <ArrowUpRight size={18} />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
