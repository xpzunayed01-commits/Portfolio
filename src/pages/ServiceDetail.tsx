import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fallbackServices } from '@/data';
import { Service } from '@/types';
import { motion } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);

  useEffect(() => {
    const s = fallbackServices.find(s => s.slug === slug);
    if (s) setService(s);
  }, [slug]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Service Not Found</h2>
          <Link to="/services" className="text-graphite-600 hover:text-graphite-900 underline underline-offset-4">Back to Services</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 mb-12 sm:mb-20">
        <Link to="/services" className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors mb-6 sm:mb-12">
          <ArrowLeft size={16} /> Back to Services
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-xs sm:text-sm font-semibold tracking-widest text-graphite-400 font-mono mb-2 sm:mb-4">
            {service.number}
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-graphite-900 mb-4 sm:mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-base sm:text-xl text-graphite-600 leading-relaxed mb-8 sm:mb-12">
            {service.shortDescription}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-base sm:prose-lg prose-graphite text-graphite-600 mb-12 sm:mb-20"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">Overview</h2>
          <p className="text-sm sm:text-base leading-relaxed mb-6 sm:mb-8">
            This service focuses on delivering high-quality, professional results tailored to your specific needs. From initial concept to final delivery, every step is designed to ensure maximum impact and value.
          </p>
          
          <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mt-8 sm:mt-12 mb-4 sm:mb-6">What I Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 not-prose mb-8 sm:mb-12">
            {['Strategy & Planning', 'Custom Design', 'Performance Optimization', 'Responsive Layouts'].map(item => (
              <div key={item} className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl bg-gray-50 border border-gray-100">
                <CheckCircle2 size={18} className="text-graphite-900 shrink-0" />
                <span className="font-semibold text-xs sm:text-sm text-graphite-900">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-graphite-900 mb-3 sm:mb-4">Deliverables</h2>
          <ul className="space-y-2 text-sm sm:text-base">
            {service.deliverables.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </motion.div>

        <div className="bg-graphite-900 text-white rounded-3xl sm:rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center shadow-xl shadow-graphite-900/10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4">Have a project in mind?</h2>
          <p className="text-gray-300 mb-8 sm:mb-10 text-sm sm:text-lg max-w-lg mx-auto leading-relaxed">
            Let's discuss how we can work together to bring your ideas to life with this service.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 bg-white text-graphite-900 text-sm sm:text-base font-bold rounded-full hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            Start a Conversation <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
