import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Monitor, Layers, Code, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fallbackProjects, fallbackServices, fallbackTools } from '@/data';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={24} className="stroke-1" />,
  Layers: <Layers size={24} className="stroke-1" />,
  Code: <Code size={24} className="stroke-1" />,
  Sparkles: <Sparkles size={24} className="stroke-1" />,
};

export function Home() {
  const featuredProjects = fallbackProjects.filter(p => p.featured);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-32 pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-sm font-semibold tracking-widest text-graphite-500 uppercase mb-6">
              Design · Development · Creativity
            </p>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-graphite-900 leading-[1.1] mb-8 text-balance">
              Turning ideas into digital experiences people remember.
            </h1>
            <p className="text-lg md:text-xl text-graphite-600 mb-10 leading-relaxed max-w-lg">
              I design thoughtful interfaces, build modern websites, and create digital experiences that are made to look good, work beautifully, and make an impact.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Link 
                to="/work" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                View My Work
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-gray-200 text-graphite-900 font-medium rounded-full hover:border-graphite-900 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Let's Work Together
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-3 text-sm text-graphite-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              Available for Freelance & Creative Opportunities
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square md:aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden flex items-center justify-center group"
          >
            {/* Placeholder for Photo/Illustration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-200 to-gray-50" />
            <div className="relative z-10 flex flex-col items-center text-graphite-400">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p className="mt-4 text-sm font-medium tracking-wide">Image Placeholder</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="flex items-end justify-between mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-graphite-900 mb-4">Selected Work</h2>
            <p className="text-graphite-600 max-w-md text-balance">A collection of recent projects spanning web design, development, and digital identity.</p>
          </div>
          <Link to="/work" className="hidden md:inline-flex items-center gap-2 text-graphite-900 font-medium hover:opacity-70 transition-opacity">
            View All Work <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {featuredProjects.map((project, idx) => (
            <motion.div 
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/work/${project.slug}`)}
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden mb-6 relative">
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-graphite-500 mb-2 uppercase tracking-wide">{project.category}</p>
                  <h3 className="text-2xl font-semibold text-graphite-900 mb-2 group-hover:underline underline-offset-4 decoration-2">{project.title}</h3>
                  <p className="text-graphite-600 text-balance line-clamp-2">{project.shortDescription}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-12 text-center md:hidden">
          <Link to="/work" className="inline-flex items-center gap-2 text-graphite-900 font-medium hover:opacity-70 transition-opacity">
            View All Work <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-white border-y border-gray-100 py-32 mb-40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-graphite-900 mb-4">Services</h2>
            <p className="text-graphite-600 text-lg text-balance">Comprehensive design and development solutions tailored to your goals.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fallbackServices.map((service, idx) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-8 rounded-3xl bg-paper border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-graphite-900 mb-8 group-hover:scale-110 transition-transform duration-300">
                  {iconMap[service.icon] || <Sparkles size={24} className="stroke-1" />}
                </div>
                <div className="text-xs font-semibold text-graphite-400 mb-4">{service.number}</div>
                <h3 className="text-xl font-semibold text-graphite-900 mb-3">{service.title}</h3>
                <p className="text-sm text-graphite-600 mb-8 line-clamp-3">{service.shortDescription}</p>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-graphite-900 group-hover:gap-3 transition-all">
                  Explore <ArrowRight size={16} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / How I Work */}
      <section className="max-w-7xl mx-auto px-6 mb-40">
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-graphite-900 mb-4">How I Work</h2>
          <p className="text-graphite-600 text-balance max-w-xl">A refined process designed to deliver exceptional results with clarity and purpose.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-gray-200 -z-10" />
          
          {[
            { num: '01', title: 'Discover', desc: 'Understand the idea, audience, and goals.' },
            { num: '02', title: 'Design', desc: 'Turn ideas into clear visual and interactive experiences.' },
            { num: '03', title: 'Build', desc: 'Develop the experience using modern technologies.' },
            { num: '04', title: 'Refine', desc: 'Test, polish and prepare the final product.' }
          ].map((step, i) => (
            <motion.div 
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative"
            >
              <div className="w-12 h-12 bg-graphite-900 text-white rounded-full flex items-center justify-center text-sm font-medium mb-6 ring-8 ring-paper">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-graphite-900 mb-2">{step.title}</h3>
              <p className="text-sm text-graphite-600">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-[3rem] p-16 md:p-24 border border-gray-100 shadow-2xl shadow-gray-200/20"
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-graphite-900 mb-6">
            Have an idea? Let's build it.
          </h2>
          <p className="text-lg text-graphite-600 mb-10 max-w-xl mx-auto">
            Whether you need a website, a digital product, a visual identity, or simply want to discuss an idea, I'd love to hear what you're working on.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95"
          >
            Send a Message
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
