import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Monitor, Layers, Code, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortfolioData } from '@/hooks/usePortfolioData';

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={24} className="stroke-1" />,
  Layers: <Layers size={24} className="stroke-1" />,
  Code: <Code size={24} className="stroke-1" />,
  Sparkles: <Sparkles size={24} className="stroke-1" />,
};

export function Home() {
  const { projects, services, profile } = usePortfolioData();
  const featuredProjects = projects.filter(p => p.featured);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 4);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20 sm:mb-32 lg:mb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <p className="text-xs sm:text-sm font-bold tracking-widest text-graphite-500 uppercase mb-4 sm:mb-6">
              {profile.tagline || 'Design · Development · Creativity'}
            </p>
            <h1 className="text-3xl sm:text-5xl lg:text-[4.25rem] font-black tracking-tight text-graphite-950 leading-[1.12] sm:leading-[1.08] mb-6 sm:mb-8 text-balance">
              {profile.heroHeadline || 'Turning ideas into digital experiences people remember.'}
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-graphite-600 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              {profile.heroSubtitle || 'I design thoughtful interfaces, build modern websites, and create digital experiences that are made to look good, work beautifully, and make an impact.'}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4">
              <Link 
                to="/work" 
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base text-center"
              >
                View My Work
              </Link>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-white border border-gray-200 text-graphite-900 font-medium rounded-full hover:border-graphite-900 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base text-center"
              >
                Let's Work Together
              </Link>
            </div>
            
            <div className="mt-8 sm:mt-12 flex items-center gap-3 text-xs sm:text-sm text-graphite-600 font-medium">
              <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-emerald-500"></span>
              </span>
              <span>{profile.availabilityStatus || 'Available for Freelance & Creative Opportunities'}</span>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/3] sm:aspect-square md:aspect-[4/5] bg-gradient-to-b from-gray-50 to-gray-100 rounded-3xl overflow-hidden flex items-center justify-center border border-gray-200/60 shadow-inner group"
          >
            <div className="relative z-10 flex flex-col items-center p-6 sm:p-8 text-center">
              <div className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-3xl bg-white shadow-xl shadow-gray-200/60 border border-gray-100 flex items-center justify-center p-4 sm:p-6 mb-4 sm:mb-6 group-hover:scale-105 transition-transform duration-500">
                <img 
                  src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
                  alt="Zunayed's Monogram" 
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-graphite-900 mb-1">{profile.name || 'Zunayed Al Hasan'}</h3>
              <p className="text-[11px] sm:text-xs font-semibold text-graphite-500 uppercase tracking-widest">{profile.professionalTitle || 'Web Designer · Creative Developer'}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Selected Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20 sm:mb-32 lg:mb-40">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 sm:mb-16">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-graphite-900 mb-2 sm:mb-4">Selected Work</h2>
            <p className="text-graphite-600 max-w-md text-sm sm:text-base text-balance">A collection of recent projects spanning web design, development, and digital identity.</p>
          </div>
          <Link to="/work" className="hidden sm:inline-flex items-center gap-2 text-graphite-900 font-semibold hover:opacity-70 transition-opacity text-sm sm:text-base">
            View All Work <ArrowRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
          {displayProjects.map((project, idx) => (
            <motion.div 
              key={project.id || project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/work/${project.slug}`)}
            >
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl sm:rounded-3xl overflow-hidden mb-4 sm:mb-6 relative border border-gray-100 shadow-2xs">
                <img 
                  src={project.coverImage} 
                  alt={project.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold text-graphite-500 mb-1.5 uppercase tracking-wide">{project.category}</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-1.5 sm:mb-2 group-hover:underline underline-offset-4 decoration-2">{project.title}</h3>
                  <p className="text-graphite-600 text-balance line-clamp-2 text-xs sm:text-sm">{project.shortDescription}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center sm:hidden">
          <Link to="/work" className="inline-flex items-center gap-2 text-graphite-900 font-semibold hover:opacity-70 transition-opacity text-sm">
            View All Work <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Services Preview */}
      <section className="bg-white border-y border-gray-100 py-20 sm:py-28 lg:py-32 mb-20 sm:mb-32 lg:mb-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-graphite-900 mb-3 sm:mb-4">Services</h2>
            <p className="text-graphite-600 text-base sm:text-lg text-balance">Comprehensive design and development solutions tailored to your goals.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {services.map((service, idx) => (
              <motion.div 
                key={service.id || service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group p-6 sm:p-8 rounded-3xl bg-paper border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/20 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-white rounded-2xl border border-gray-100 flex items-center justify-center text-graphite-900 mb-6 group-hover:scale-110 transition-transform duration-300">
                    {iconMap[service.icon] || <Sparkles size={24} className="stroke-1" />}
                  </div>
                  <div className="text-xs font-mono font-bold text-graphite-400 mb-3">{service.number}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-graphite-900 mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-xs sm:text-sm text-graphite-600 mb-6 line-clamp-3 leading-relaxed">{service.shortDescription}</p>
                </div>
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-xs font-bold text-graphite-900 group-hover:gap-3 transition-all pt-2">
                  Explore <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process / How I Work */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-20 sm:mb-32 lg:mb-40">
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-graphite-900 mb-3 sm:mb-4">How I Work</h2>
          <p className="text-graphite-600 text-balance max-w-xl text-sm sm:text-base">A refined process designed to deliver exceptional results with clarity and purpose.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 relative">
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
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-graphite-900 text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-bold mb-4 sm:mb-6 ring-4 sm:ring-8 ring-paper">
                {step.num}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-graphite-900 mb-1.5 sm:mb-2">{step.title}</h3>
              <p className="text-xs sm:text-sm text-graphite-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-14 md:p-20 border border-gray-100 shadow-xl shadow-gray-200/30"
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-graphite-900 mb-4 sm:mb-6">
            Have an idea? Let's build it.
          </h2>
          <p className="text-sm sm:text-lg text-graphite-600 mb-8 sm:mb-10 max-w-xl mx-auto leading-relaxed">
            Whether you need a website, a digital product, a visual identity, or simply want to discuss an idea, I'd love to hear what you're working on.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 sm:px-8 sm:py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-all hover:scale-105 active:scale-95 text-sm sm:text-base"
          >
            Send a Message
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
