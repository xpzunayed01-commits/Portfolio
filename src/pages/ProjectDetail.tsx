import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fallbackProjects } from '@/data';
import { Project } from '@/types';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // In a real app with Supabase, we would fetch by slug here
    const p = fallbackProjects.find(p => p.slug === slug);
    if (p) setProject(p);
  }, [slug]);

  if (!project) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Project Not Found</h2>
          <Link to="/work" className="text-graphite-600 hover:text-graphite-900 underline underline-offset-4">Back to Work</Link>
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
            <span className="px-3 py-1 bg-graphite-100 text-graphite-600 text-xs font-semibold uppercase tracking-widest rounded-md border border-gray-200">
              {project.category}
            </span>
            <span className="text-graphite-400 font-medium">{project.year}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-graphite-900 mb-8 max-w-4xl leading-tight">
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
          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Overview</h2>
          <p className="mb-12">{project.overview}</p>

          {project.problem && (
            <>
              <h2 className="text-2xl font-semibold text-graphite-900 mb-4">The Challenge</h2>
              <p className="mb-12">{project.problem}</p>
            </>
          )}

          {project.process && (
            <>
              <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Process & Solution</h2>
              <p className="mb-12">{project.process}</p>
            </>
          )}
        </div>

        <div className="space-y-12">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-4">Client</h3>
            <p className="text-lg font-medium text-graphite-900">{project.client}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-4">Technologies</h3>
            <ul className="space-y-2 text-lg font-medium text-graphite-900">
              {project.technologies.map(tech => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
          </div>

          {project.liveUrl && project.liveUrl !== '#' && (
            <div className="pt-8 border-t border-gray-100">
              <a 
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg font-medium text-graphite-900 hover:opacity-70 transition-opacity"
              >
                View Live Project <ArrowUpRight size={20} />
              </a>
            </div>
          )}
        </div>
      </div>
      
      {project.gallery && project.gallery.length > 0 && (
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl font-semibold text-graphite-900 mb-8">Gallery</h2>
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
