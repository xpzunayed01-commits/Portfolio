import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Project } from '@/types';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { projects } = usePortfolioData();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = projects.find(item => item.slug === slug || item.id === slug);
    if (p) {
      setProject(p);
    }
  }, [slug, projects]);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-graphite-900 mb-4">Project Not Found</h2>
          <Link to="/work" className="text-graphite-600 hover:text-graphite-900 underline underline-offset-4">
            Back to Work
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <Link to="/work" className="inline-flex items-center gap-2 text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors mb-12">
          <ArrowLeft size={16} /> Back to all projects
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-graphite-100 text-graphite-700 text-xs font-bold uppercase tracking-widest rounded-md border border-gray-200">
              {project.category}
            </span>
            <span className="text-graphite-400 font-medium">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-graphite-900 mb-8 max-w-4xl leading-tight">
            {project.title}
          </h1>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="max-w-7xl mx-auto px-6 mb-20"
      >
        <div className="w-full aspect-video bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 mb-24">
        <div className="lg:col-span-2 prose prose-lg text-graphite-600">
          <h2 className="text-2xl font-bold text-graphite-900 mb-4">Overview</h2>
          <p className="mb-12 leading-relaxed">{project.overview || project.shortDescription}</p>

          {project.problem && (
            <>
              <h2 className="text-2xl font-bold text-graphite-900 mb-4">The Challenge</h2>
              <p className="mb-12 leading-relaxed">{project.problem}</p>
            </>
          )}

          {project.process && (
            <>
              <h2 className="text-2xl font-bold text-graphite-900 mb-4">Process & Solution</h2>
              <p className="mb-12 leading-relaxed">{project.process}</p>
            </>
          )}
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-graphite-500 mb-3">Client</h3>
            <p className="text-lg font-bold text-graphite-900">{project.client || 'Self-Initiated'}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-graphite-500 mb-3">Technologies</h3>
            <ul className="space-y-2 text-base font-semibold text-graphite-900">
              {project.technologies?.map(tech => (
                <li key={tech} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-graphite-900/60"></span>
                  {tech}
                </li>
              ))}
            </ul>
          </div>

          {project.liveUrl && project.liveUrl !== '#' && (
            <div className="pt-8 border-t border-gray-100">
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-base font-bold text-graphite-900 hover:opacity-70 transition-opacity"
              >
                View Live Project <ArrowUpRight size={18} />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-graphite-900 mb-8">Gallery</h2>
          <div className="grid grid-cols-1 gap-8">
            {project.gallery.map((img, i) => (
              <div key={i} className="w-full bg-gray-100 rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
                <img src={img} alt={`Gallery ${i}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
