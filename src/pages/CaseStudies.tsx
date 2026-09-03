import React from 'react';
import { motion } from 'motion/react';
import { fallbackProjects } from '@/data';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CaseStudies() {
  const caseStudies = fallbackProjects.filter(p => p.overview || p.problem);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-semibold tracking-tight text-graphite-900 mb-6"
        >
          Case Studies
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-graphite-600 max-w-2xl"
        >
          In-depth looks into my process, from initial discovery to final execution.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {caseStudies.map((cs, idx) => (
            <motion.div
              key={cs.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Link to={`/case-studies/${cs.slug}`} className="block">
                <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden mb-6 relative shadow-sm border border-gray-100">
                  <img 
                    src={cs.coverImage} 
                    alt={cs.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-2xl font-semibold text-graphite-900 mb-3 group-hover:underline underline-offset-4 decoration-2">
                  {cs.title}
                </h3>
                <p className="text-graphite-600 line-clamp-2 mb-4">{cs.overview}</p>
                <div className="inline-flex items-center gap-2 text-sm font-medium text-graphite-900">
                  Read Case Study <ArrowRight size={16} />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
