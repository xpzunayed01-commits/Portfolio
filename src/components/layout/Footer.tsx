import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
              <img 
                src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
                alt="Zunayed's Portfolio" 
                className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="text-xl font-semibold tracking-tight text-graphite-900">
                Zunayed's Portfolio
              </span>
            </Link>
            <p className="text-graphite-600 max-w-sm">
              Web Designer · UI/UX Designer · Creative Developer
            </p>
            <p className="mt-6 text-sm text-graphite-500 max-w-sm">
              Designing thoughtful interfaces, building modern websites, and creating digital experiences that are made to look good and work beautifully.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-graphite-900 uppercase tracking-wider mb-6">
              Navigation
            </h3>
            <ul className="space-y-4 text-graphite-600">
              <li>
                <Link to="/work" className="hover:text-graphite-900 transition-colors">Work</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-graphite-900 transition-colors">Services</Link>
              </li>
              <li>
                <Link to="/case-studies" className="hover:text-graphite-900 transition-colors">Case Studies</Link>
              </li>
              <li>
                <Link to="/certificates" className="hover:text-graphite-900 transition-colors">Certificates</Link>
              </li>
              <li>
                <Link to="/cv" className="hover:text-graphite-900 transition-colors">CV / Resume</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-graphite-900 transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-graphite-900 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-graphite-900 uppercase tracking-wider mb-6">
              Socials
            </h3>
            <ul className="space-y-4 text-graphite-600">
              <li>
                <a href="#" className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors">
                  LinkedIn <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="#" className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors">
                  GitHub <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="#" className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors">
                  Twitter/X <ArrowUpRight size={14} />
                </a>
              </li>
              <li>
                <a href="mailto:hello@example.com" className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors">
                  Email <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-graphite-500">
          <p>© {currentYear} Zunayed Al Hasan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
