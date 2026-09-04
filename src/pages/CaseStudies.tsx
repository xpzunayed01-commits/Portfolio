import React from 'react';
import { motion } from 'motion/react';
import { fallbackProjects } from '@/data';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CaseStudies() {
  const caseStudies = fallbackProjects.filter(p => p.overview || p.problem);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 mb-3 sm:mb-6 leading-tight"
        >
          Case Studies
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-graphite-600 max-w-2xl leading-relaxed"
        >
          In-depth looks into my process, from initial discovery to final execution.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
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
                <div className="aspect-[4/3] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 relative shadow-xs border border-gray-100">
                  <img 
                    src={cs.coverImage} 
                    alt={cs.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-2 group-hover:underline underline-offset-4 decoration-2">
                  {cs.title}
                </h3>
                <p className="text-graphite-600 line-clamp-2 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">{cs.overview}</p>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-graphite-900">
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
