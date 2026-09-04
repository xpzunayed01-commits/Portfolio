import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Maximize2, X, ExternalLink } from 'lucide-react';

export function Certificates() {
  const { certificates } = usePortfolioData();
  const [selectedCert, setSelectedCert] = useState<string | null>(null);

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-10 sm:mb-16">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-5xl font-black tracking-tight text-graphite-900 mb-3 sm:mb-6"
        >
          Certificates & Learning
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-base sm:text-lg text-graphite-600 max-w-2xl leading-relaxed"
        >
          Continuous learning and professional qualifications in design and development.
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {certificates.map((cert, idx) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group bg-white border border-gray-100 rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all cursor-pointer overflow-hidden flex flex-col"
              onClick={() => setSelectedCert(cert.image)}
            >
              <div className="w-full aspect-[4/3] bg-gray-50 rounded-xl sm:rounded-2xl mb-5 sm:mb-8 overflow-hidden border border-gray-100 relative">
                <img src={cert.image} alt={cert.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-graphite-900/0 group-hover:bg-graphite-900/10 flex items-center justify-center transition-colors">
                  <Maximize2 size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-graphite-900 mb-1.5 sm:mb-2">{cert.title}</h3>
              <p className="text-xs sm:text-sm font-medium text-graphite-600 mb-4 sm:mb-6">{cert.issuer}</p>
              
              <div className="mt-auto space-y-1.5 sm:space-y-2 pt-3 sm:pt-4 border-t border-gray-100">
                <div className="flex justify-between text-xs text-graphite-500">
                  <span>Issued:</span>
                  <span className="font-semibold text-graphite-900">{cert.issued}</span>
                </div>
                {cert.expiration && (
                  <div className="flex justify-between text-xs text-graphite-500">
                    <span>Expires:</span>
                    <span className="font-semibold text-graphite-900">{cert.expiration}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {selectedCert && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/95 backdrop-blur-xs"
            onClick={() => setSelectedCert(null)}
          >
            <button 
              className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/80 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors cursor-pointer"
              onClick={() => setSelectedCert(null)}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>
            <img 
              src={selectedCert} 
              alt="Certificate Full" 
              className="max-w-[95vw] max-h-[85vh] rounded-lg shadow-2xl object-contain" 
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
