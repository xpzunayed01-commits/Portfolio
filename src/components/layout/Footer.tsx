import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { profile, settings } = usePortfolioData();

  const emailAddress = settings.contactEmail || profile.email || 'xpzunayed01@gmail.com';
  const linkedinUrl = settings.linkedinUrl || profile.linkedinUrl || 'https://linkedin.com/in/zunayedalhasan';
  const githubUrl = settings.githubUrl || profile.githubUrl || 'https://github.com/zunayedalhasan';
  const dribbbleUrl = settings.dribbbleUrl || profile.dribbbleUrl || 'https://dribbble.com/zunayedalhasan';
  const behanceUrl = settings.behanceUrl || profile.behanceUrl || 'https://behance.net/zunayedalhasan';

  return (
    <footer className="bg-white border-t border-gray-100 pt-12 sm:pt-20 pb-8 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12 sm:mb-16">
          <div className="sm:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-3 sm:mb-4 group" aria-label="Zunayed's Portfolio Home">
              <img 
                src="https://i.postimg.cc/HscpyzS5/a-premium-minimal-geometric-monogram-logo-mark-com-(1)-Photoroom.png" 
                alt="Zunayed's Portfolio" 
                className="h-9 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="text-lg sm:text-xl font-black tracking-tight text-graphite-900">
                {settings.siteName || "Zunayed's Portfolio"}
              </span>
            </Link>
            <p className="text-graphite-600 text-sm sm:text-base font-medium max-w-sm leading-relaxed">
              {profile.professionalTitle || 'Web Designer · UI/UX Designer · Creative Developer'}
            </p>
            <p className="mt-3 sm:mt-5 text-xs sm:text-sm text-graphite-500 max-w-sm leading-relaxed">
              {profile.heroSubtitle || 'Designing thoughtful interfaces, building modern websites, and creating digital experiences that are made to look good and work beautifully.'}
            </p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold text-graphite-900 uppercase tracking-widest mb-4 sm:mb-6">
              Navigation
            </h3>
            <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm font-medium text-graphite-600">
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
            <h3 className="text-xs font-bold text-graphite-900 uppercase tracking-widest mb-4 sm:mb-6">
              Connect
            </h3>
            <ul className="space-y-3 sm:space-y-3.5 text-xs sm:text-sm font-medium text-graphite-600">
              {linkedinUrl && (
                <li>
                  <a 
                    href={linkedinUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors"
                  >
                    LinkedIn <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              {githubUrl && (
                <li>
                  <a 
                    href={githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors"
                  >
                    GitHub <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              {behanceUrl && (
                <li>
                  <a 
                    href={behanceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors"
                  >
                    Behance <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              {dribbbleUrl && (
                <li>
                  <a 
                    href={dribbbleUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors"
                  >
                    Dribbble <ArrowUpRight size={14} />
                  </a>
                </li>
              )}
              <li>
                <a 
                  href={`mailto:${emailAddress}`} 
                  className="inline-flex items-center gap-1 hover:text-graphite-900 transition-colors"
                >
                  Email Directly <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-graphite-500">
          <p>{settings.footerText || `© ${currentYear} Zunayed Al Hasan. All rights reserved.`}</p>
        </div>
      </div>
    </footer>
  );
}
