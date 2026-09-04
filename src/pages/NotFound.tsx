import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-24">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 text-graphite-900 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-200">
          <Compass size={28} />
        </div>
        <span className="text-xs font-bold text-graphite-400 uppercase tracking-widest">404 Error</span>
        <h1 className="text-4xl font-extrabold text-graphite-950 mt-2 mb-4 tracking-tight">
          Page Not Found
        </h1>
        <p className="text-graphite-600 text-sm mb-8 leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-graphite-950 text-white rounded-full text-xs font-bold hover:bg-graphite-800 transition-all shadow-xs"
          >
            <Home size={14} />
            <span>Back to Home</span>
          </Link>
          <Link 
            to="/work" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-graphite-900 rounded-full text-xs font-bold hover:border-graphite-900 transition-all shadow-2xs"
          >
            <span>View Projects</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
