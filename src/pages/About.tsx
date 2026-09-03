import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { fallbackTools, fallbackCertificates } from '@/data';
import { ArrowRight, Download, Maximize2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const skills = [
  { category: 'Design', items: ['UI/UX Design', 'Web Design', 'Graphic Design', 'Logo Design', 'Brand Identity', 'Visual Design', 'Typography', 'Layout & Composition'] },
  { category: 'Development', items: ['Next.js', 'React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Frontend Development', 'Git & GitHub', 'Vercel'] },
  { category: 'Creative', items: ['Creative Direction', 'Visual Storytelling', 'AI-assisted Design', 'AI-assisted Development', 'Content Creation'] }
];

export function About() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Intro Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-32"
          >
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-graphite-900 mb-6 leading-tight">
              Designing with purpose.<br />Building with intent.
            </h1>
            <p className="text-xl text-graphite-600 mb-8 max-w-md">
              A creative designer and developer bridging the gap between visual aesthetics and functional engineering.
            </p>
            <div className="flex gap-4">
              <Link to="/contact" className="px-8 py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                Say Hello <ArrowRight size={18} />
              </Link>
              <button className="px-8 py-4 bg-white border border-gray-200 text-graphite-900 font-medium rounded-full hover:border-graphite-900 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2">
                CV <Download size={18} />
              </button>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg text-graphite-600"
          >
            <p className="mb-6">
              I'm Zunayed Al Hasan, a freelance Web Designer, UI/UX Designer, and Creative Developer based on the intersection of creativity and logic. I specialize in taking an idea from a rough concept to a highly polished digital experience.
            </p>
            <p className="mb-6">
              Whether I'm designing a premium visual identity, crafting a complex user interface, or developing a responsive web application, my focus is always on clarity, accessibility, and modern aesthetics.
            </p>
            <p className="mb-12">
              I believe the best products don't just look beautiful—they feel intuitive. Using modern technologies and AI-assisted workflows, I build scalable solutions that solve real problems.
            </p>

            {/* Profile image placeholder */}
            <div className="aspect-[4/3] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center relative mb-12 shadow-inner">
               <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50" />
               <div className="relative z-10 text-graphite-400 text-sm font-medium">Portrait Placeholder</div>
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section className="mb-40">
          <h2 className="text-3xl font-semibold text-graphite-900 mb-12">Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {skills.map((group, idx) => (
              <motion.div 
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-6">{group.category}</h3>
                <ul className="space-y-4">
                  {group.items.map(item => (
                    <li key={item} className="text-lg font-medium text-graphite-900 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-900/30"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section className="mb-40">
          <div className="flex items-end justify-between mb-12">
            <h2 className="text-3xl font-semibold text-graphite-900">Certificates & Learning</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fallbackCertificates.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedCert(cert.image)}
              >
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={20} className="text-graphite-500" />
                </div>
                <div className="w-16 h-16 bg-gray-50 rounded-xl mb-6 overflow-hidden border border-gray-100">
                   <img src={cert.image} alt="cert" className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-semibold text-graphite-900 mb-2 leading-snug pr-8">{cert.title}</h3>
                <p className="text-sm text-graphite-600 mb-4">{cert.issuer}</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md text-xs font-medium text-graphite-500">
                  Issued: {cert.issued}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-40">
          <h2 className="text-3xl font-semibold text-graphite-900 mb-12 text-center">Tools I Work With</h2>
          <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
            {fallbackTools.map((tool, idx) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
              >
                <span className="font-medium text-graphite-900">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/90 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white/70 hover:text-white transition-colors"
              onClick={() => setSelectedCert(null)}
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedCert} 
              alt="Certificate Full" 
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" 
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
