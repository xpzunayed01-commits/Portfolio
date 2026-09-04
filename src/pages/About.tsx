import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { ArrowRight, Download, Maximize2, X, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultSkills = [
  { category: 'Design', items: ['UI/UX Design', 'Web Design', 'Graphic Design', 'Logo Design', 'Brand Identity', 'Visual Design', 'Typography', 'Layout & Composition'] },
  { category: 'Development', items: ['Next.js', 'React', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS', 'Frontend Engineering', 'Vite & Vercel'] },
  { category: 'Creative & Strategy', items: ['Creative Direction', 'Visual Storytelling', 'Design Systems', 'AI-assisted Workflows', 'Accessible UX'] }
];

export function About() {
  const [selectedCert, setSelectedCert] = useState<string | null>(null);
  const { certificates, profile, tools } = usePortfolioData();

  const publishedCertificates = certificates.filter(c => c.published !== false);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        
        {/* Intro Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-start mb-20 sm:mb-32 lg:mb-40">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-32"
          >
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-graphite-900 mb-4 sm:mb-6 leading-tight">
              Designing with purpose.<br />Building with intent.
            </h1>
            <p className="text-base sm:text-xl text-graphite-600 mb-6 sm:mb-8 max-w-md leading-relaxed">
              {profile.heroSubtitle || 'A creative designer and developer bridging the gap between visual aesthetics and functional engineering.'}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/contact" className="px-6 py-3.5 sm:px-8 sm:py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 text-sm sm:text-base">
                Say Hello <ArrowRight size={18} />
              </Link>
              <Link to="/cv" className="px-6 py-3.5 sm:px-8 sm:py-4 bg-white border border-gray-200 text-graphite-900 font-medium rounded-full hover:border-graphite-900 transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-2 text-sm sm:text-base">
                View CV <FileText size={18} />
              </Link>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg text-graphite-600"
          >
            <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
              {profile.aboutBio || `I'm Zunayed Al Hasan, a freelance Web Designer, UI/UX Designer, and Creative Developer based on the intersection of creativity and logic. I specialize in taking an idea from a rough concept to a highly polished digital experience.`}
            </p>
            <p className="mb-4 sm:mb-6 text-base sm:text-lg leading-relaxed">
              Whether I'm designing a premium visual identity, crafting a complex user interface, or developing a responsive web application, my focus is always on clarity, accessibility, and modern aesthetics.
            </p>
            <p className="mb-8 sm:mb-12 text-base sm:text-lg leading-relaxed">
              I believe the best products don't just look beautiful—they feel intuitive. Using modern technologies and deliberate design systems, I build scalable solutions that solve real problems.
            </p>

            {/* Profile image placeholder / avatar */}
            <div className="aspect-[4/3] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden flex items-center justify-center relative mb-8 sm:mb-12 shadow-2xs border border-gray-100">
               {profile.avatarUrl ? (
                 <img 
                   src={profile.avatarUrl} 
                   alt={profile.name || "Zunayed Al Hasan"} 
                   className="w-full h-full object-cover"
                   referrerPolicy="no-referrer"
                 />
               ) : (
                 <>
                   <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50" />
                   <div className="relative z-10 text-graphite-500 text-xs sm:text-sm font-medium">Zunayed Al Hasan · Creative Developer</div>
                 </>
               )}
            </div>
          </motion.div>
        </section>

        {/* Skills Section */}
        <section className="mb-20 sm:mb-32 lg:mb-40">
          <h2 className="text-2xl sm:text-3xl font-bold text-graphite-900 mb-8 sm:mb-12">Competencies</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-12">
            {defaultSkills.map((group, idx) => (
              <motion.div 
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-xs font-bold uppercase tracking-widest text-graphite-500 mb-4 sm:mb-6">{group.category}</h3>
                <ul className="space-y-3 sm:space-y-4">
                  {group.items.map(item => (
                    <li key={item} className="text-base sm:text-lg font-medium text-graphite-900 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-900/40"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certificates */}
        <section className="mb-20 sm:mb-32 lg:mb-40">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-graphite-900">Certificates & Learning</h2>
            <Link to="/certificates" className="text-sm font-semibold text-graphite-900 hover:opacity-70 transition-opacity inline-flex items-center gap-1">
              View All Certificates <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {publishedCertificates.slice(0, 6).map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer overflow-hidden"
                onClick={() => setSelectedCert(cert.image)}
              >
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={18} className="text-graphite-500" />
                </div>
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-50 rounded-xl mb-4 sm:mb-6 overflow-hidden border border-gray-100">
                   <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-graphite-900 mb-1.5 sm:mb-2 leading-snug pr-6">{cert.title}</h3>
                <p className="text-xs sm:text-sm text-graphite-600 mb-3 sm:mb-4">{cert.issuer}</p>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-gray-50 rounded-md text-[11px] sm:text-xs font-medium text-graphite-500">
                  Issued: {cert.issued}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tools Section */}
        <section className="mb-20 sm:mb-32 lg:mb-40">
          <h2 className="text-2xl sm:text-3xl font-bold text-graphite-900 mb-8 sm:mb-12 text-center">Tools & Technologies</h2>
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 max-w-4xl mx-auto">
            {tools.map((tool, idx) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="px-4 py-2.5 sm:px-6 sm:py-4 bg-white border border-gray-100 rounded-xl sm:rounded-2xl shadow-2xs hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-2 sm:gap-3"
              >
                <span className="font-semibold text-graphite-900 text-xs sm:text-sm">{tool.name}</span>
                <span className="text-[10px] sm:text-xs text-graphite-400">· {tool.category}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/90 backdrop-blur-xs"
            onClick={() => setSelectedCert(null)}
          >
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              onClick={() => setSelectedCert(null)}
              aria-label="Close certificate preview"
            >
              <X size={24} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedCert} 
              alt="Certificate Full" 
              className="max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl object-contain" 
              referrerPolicy="no-referrer"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
