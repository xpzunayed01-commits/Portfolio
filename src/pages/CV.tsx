import React from 'react';
import { motion } from 'motion/react';
import { Download, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CV() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-paper">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-16 rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/40"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-gray-100 pb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-graphite-900 mb-4">Zunayed Al Hasan</h1>
              <p className="text-xl text-graphite-600">Web Designer · UI/UX Designer · Creative Developer</p>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all active:scale-95 inline-flex items-center gap-2">
                Download PDF <Download size={18} />
              </button>
            </div>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-6">Professional Summary</h2>
              <p className="text-lg text-graphite-600 leading-relaxed">
                Creative designer and developer bridging the gap between visual aesthetics and functional engineering. Specializing in UI/UX design, modern web development, and digital identity creation. Focused on building clean, accessible, and highly functional digital experiences that solve real problems.
              </p>
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-6">Experience</h2>
              <div className="space-y-12">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-graphite-900">Freelance Web Designer & Developer</h3>
                    <span className="text-sm font-medium text-graphite-500">2022 — Present</span>
                  </div>
                  <p className="text-graphite-600 mb-4">Self-Employed</p>
                  <ul className="list-disc pl-5 text-graphite-600 space-y-2">
                    <li>Designed and developed highly responsive, editorial-style portfolios and marketing websites.</li>
                    <li>Created comprehensive brand identities including logo design, typography selection, and visual systems.</li>
                    <li>Utilized React, Next.js, and Tailwind CSS to build performant, accessible digital products.</li>
                    <li>Collaborated directly with clients to define requirements, goals, and technical specifications.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-6">Core Skills</h2>
                <ul className="space-y-3">
                  {['UI/UX Design', 'Web Design', 'Frontend Development', 'Brand Identity', 'Responsive Design', 'Interactive Prototyping'].map(s => (
                    <li key={s} className="text-graphite-900 font-medium flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-300"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-6">Technologies</h2>
                <ul className="space-y-3">
                  {['React / Next.js', 'TypeScript / JavaScript', 'Tailwind CSS', 'Figma / Illustrator', 'Supabase / Firebase', 'Vite / Vercel'].map(s => (
                    <li key={s} className="text-graphite-900 font-medium flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-300"></div> {s}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
            
            <section className="pt-12 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <Link to="/work" className="inline-flex items-center gap-2 text-graphite-900 font-medium hover:opacity-70 transition-opacity">
                View Selected Work <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 text-graphite-900 font-medium hover:opacity-70 transition-opacity">
                Get in Touch <ArrowRight size={18} />
              </Link>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
