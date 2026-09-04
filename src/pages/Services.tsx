import React from 'react';
import { motion } from 'motion/react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Monitor, Layers, Code, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={24} className="stroke-1" />,
  Layers: <Layers size={24} className="stroke-1" />,
  Code: <Code size={24} className="stroke-1" />,
  Sparkles: <Sparkles size={24} className="stroke-1" />,
};

export function Services() {
  const { services } = usePortfolioData();

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold tracking-tight text-graphite-900 mb-6 max-w-3xl leading-tight"
        >
          Elevating brands through strategic design and modern technology.
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-graphite-600 max-w-2xl"
        >
          I offer a comprehensive suite of digital services designed to help businesses establish a powerful online presence and connect with their audience.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {services.map((service, idx) => (
            <motion.div
              key={service.id || service.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group flex flex-col h-full bg-white border border-gray-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-gray-200/40 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-paper border border-gray-100 flex items-center justify-center text-graphite-900 group-hover:scale-110 transition-transform duration-500">
                  {iconMap[service.icon] || <Sparkles size={24} className="stroke-1" />}
                </div>
                <span className="text-sm font-semibold text-graphite-400 font-mono tracking-widest">{service.number}</span>
              </div>
              
              <h2 className="text-3xl font-bold text-graphite-900 mb-4">{service.title}</h2>
              <p className="text-lg text-graphite-600 mb-10 text-balance flex-grow">{service.shortDescription}</p>
              
              <div className="mb-10">
                <h4 className="text-xs font-bold uppercase tracking-widest text-graphite-400 mb-4">Deliverables</h4>
                <ul className="space-y-3">
                  {service.deliverables?.map(item => (
                    <li key={item} className="text-sm font-medium text-graphite-900 flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-graphite-900/40"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8 border-t border-gray-100 mt-auto">
                <Link to={`/services/${service.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-graphite-900 group-hover:gap-4 transition-all">
                  Inquire about this service <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
