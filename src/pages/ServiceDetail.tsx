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
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-6 mb-20">
        <Link to="/services" className="inline-flex items-center gap-2 text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors mb-12">
          <ArrowLeft size={16} /> Back to Services
        </Link>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-sm font-semibold tracking-widest text-graphite-400 font-mono mb-4">
            {service.number}
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-graphite-900 mb-6 leading-tight">
            {service.title}
          </h1>
          <p className="text-xl text-graphite-600 leading-relaxed mb-12">
            {service.shortDescription}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="prose prose-lg prose-graphite text-graphite-600 mb-20"
        >
          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Overview</h2>
          <p>
            This service focuses on delivering high-quality, professional results tailored to your specific needs. From initial concept to final delivery, every step is designed to ensure maximum impact and value.
          </p>
          
          <h2 className="text-2xl font-semibold text-graphite-900 mt-12 mb-6">What I Can Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mb-12">
            {['Strategy & Planning', 'Custom Design', 'Performance Optimization', 'Responsive Layouts'].map(item => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 size={20} className="text-graphite-900" />
                <span className="font-medium text-graphite-900">{item}</span>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-semibold text-graphite-900 mb-4">Deliverables</h2>
          <ul>
            {service.deliverables.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </motion.div>

        <div className="bg-graphite-900 text-white rounded-[2.5rem] p-12 md:p-16 text-center shadow-xl shadow-graphite-900/10">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Have a project in mind?</h2>
          <p className="text-gray-300 mb-10 text-lg max-w-lg mx-auto">
            Let's discuss how we can work together to bring your ideas to life with this service.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-graphite-900 font-medium rounded-full hover:bg-gray-100 transition-all hover:scale-105"
          >
            Start a Conversation <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
