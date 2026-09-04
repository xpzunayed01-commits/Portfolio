import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight, Printer, Mail, MapPin, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export function CV() {
  const { profile, settings } = usePortfolioData();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20 bg-paper">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-10 md:p-16 rounded-3xl sm:rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40 print:shadow-none print:border-none print:p-0"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-10 sm:mb-16 border-b border-gray-100 pb-8 sm:pb-12">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-graphite-950 mb-2 sm:mb-3">
                {profile.name || 'Zunayed Al Hasan'}
              </h1>
              <p className="text-base sm:text-lg md:text-xl font-medium text-graphite-600 mb-3 sm:mb-4">
                {profile.professionalTitle || 'Web Designer · UI/UX Designer · Creative Developer'}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-semibold text-graphite-500">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="shrink-0" />
                  {profile.location || 'Dhaka, Bangladesh · Remote Worldwide'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail size={14} className="shrink-0" />
                  {settings.contactEmail || profile.email || 'xpzunayed01@gmail.com'}
                </span>
              </div>
            </div>
            <div className="flex gap-3 print:hidden">
              <button 
                onClick={handlePrint}
                className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-graphite-950 text-white font-bold text-xs rounded-full hover:bg-graphite-800 transition-all active:scale-95 inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <Printer size={15} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>

          <div className="space-y-10 sm:space-y-16">
            <section>
              <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-graphite-400 mb-3 sm:mb-4">Professional Summary</h2>
              <p className="text-sm sm:text-base md:text-lg text-graphite-700 leading-relaxed">
                {profile.aboutBio || 'Creative designer and developer bridging the gap between visual aesthetics and functional engineering. Specializing in UI/UX design, modern web development, and digital identity creation. Focused on building clean, accessible, and highly functional digital experiences that solve real problems.'}
              </p>
            </section>

            <section>
              <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-graphite-400 mb-4 sm:mb-6">Experience</h2>
              <div className="space-y-6 sm:space-y-8">
                {profile.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp) => (
                    <div key={exp.id} className="pb-5 sm:pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-1">
                        <h3 className="text-base sm:text-lg font-bold text-graphite-900">{exp.role}</h3>
                        <span className="text-xs font-semibold text-graphite-500">{exp.period}</span>
                      </div>
                      <p className="text-xs font-bold text-graphite-500 mb-2 sm:mb-3">{exp.company}</p>
                      <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">{exp.description}</p>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 sm:mb-2 gap-1">
                      <h3 className="text-lg sm:text-xl font-bold text-graphite-900">Lead UI/UX Designer & Developer</h3>
                      <span className="text-xs sm:text-sm font-medium text-graphite-500">2022 — Present</span>
                    </div>
                    <p className="text-xs sm:text-sm text-graphite-600 mb-3 sm:mb-4 font-medium">Independent Studio</p>
                    <ul className="list-disc pl-5 text-graphite-600 space-y-1.5 sm:space-y-2 text-xs sm:text-sm leading-relaxed">
                      <li>Designed and engineered high-performance responsive web applications, design systems, and client platforms.</li>
                      <li>Created comprehensive brand systems including typography hierarchy, component libraries, and interactive prototypes.</li>
                      <li>Built and maintained modern React, TypeScript, and Tailwind CSS codebases with high accessibility standards.</li>
                    </ul>
                  </div>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-graphite-400 mb-4 sm:mb-6">Design Capabilities</h2>
                <ul className="space-y-2.5 sm:space-y-3">
                  {(profile.skills?.design || ['UI/UX Design', 'Web Design', 'Design Systems', 'Brand Identity', 'Responsive Design', 'Interactive Prototyping']).map(s => (
                    <li key={s} className="text-graphite-900 font-medium text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-400 shrink-0"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-graphite-400 mb-4 sm:mb-6">Engineering & Tools</h2>
                <ul className="space-y-2.5 sm:space-y-3">
                  {(profile.skills?.development || ['React & TypeScript', 'Tailwind CSS', 'Vite & Next.js', 'Figma & Adobe CC', 'Cloud Firestore', 'Git & CI/CD']).map(s => (
                    <li key={s} className="text-graphite-900 font-medium text-xs sm:text-sm flex items-center gap-2.5 sm:gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-400 shrink-0"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            
            <section className="pt-8 sm:pt-12 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 print:hidden">
              <Link to="/work" className="inline-flex items-center gap-2 text-graphite-900 font-bold hover:opacity-70 transition-opacity text-xs sm:text-sm">
                View Selected Work <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-graphite-900 font-bold hover:opacity-70 transition-opacity text-xs sm:text-sm">
                Get in Touch <ArrowRight size={16} />
              </Link>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
