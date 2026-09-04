import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Mail, MapPin, Globe } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { usePortfolioData } from '@/hooks/usePortfolioData';

export function Contact() {
  const { profile, settings } = usePortfolioData();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website Design',
    budget: '$1k - $5k',
    message: ''
  });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Honeypot check for automated bot submissions
    if (honeypot.trim().length > 0) {
      setStatus('success');
      return;
    }

    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const cleanMessage = formData.message.trim();

    if (!cleanName || cleanName.length < 2) {
      setErrorMessage('Please provide a valid name (at least 2 characters).');
      return;
    }

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 10) {
      setErrorMessage('Please provide some project details (at least 10 characters).');
      return;
    }

    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'contactMessages'), {
        name: cleanName.slice(0, 100),
        email: cleanEmail.slice(0, 120),
        projectType: formData.projectType.slice(0, 100),
        budget: formData.budget.slice(0, 100),
        message: cleanMessage.slice(0, 5000),
        status: 'unread',
        createdAt: serverTimestamp()
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', projectType: 'Website Design', budget: '$1k - $5k', message: '' });
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage('Failed to send inquiry. Please try again or email directly.');
    }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-32 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <span className="text-xs font-bold uppercase tracking-widest text-graphite-500 mb-2 sm:mb-3 block">
            Start a Conversation
          </span>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-graphite-950 mb-4 sm:mb-6 leading-tight">
            Have an idea?<br />Let's build it.
          </h1>
          <p className="text-base sm:text-lg text-graphite-600 mb-8 sm:mb-12 leading-relaxed">
            Whether you need a bespoke website, UI/UX design sprint, brand identity overhaul, or want to discuss a new product concept, I'd love to hear what you are working on.
          </p>

          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs text-graphite-900 shrink-0">
                <Mail size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-graphite-500 mb-0.5 sm:mb-1">Email Directly</h3>
                <a 
                  href={`mailto:${settings.contactEmail || profile.email || 'hello@zunayed.me'}`} 
                  className="text-base sm:text-lg font-bold text-graphite-900 hover:text-graphite-600 transition-colors break-all"
                >
                  {settings.contactEmail || profile.email || 'hello@zunayed.me'}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs text-graphite-900 shrink-0">
                <MapPin size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-graphite-500 mb-0.5 sm:mb-1">Location</h3>
                <p className="text-sm sm:text-base font-semibold text-graphite-900">{profile.location || 'Dhaka, Bangladesh · Available Worldwide (Remote)'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="p-2.5 sm:p-3 bg-white border border-gray-200 rounded-2xl shadow-2xs text-graphite-900 shrink-0">
                <Globe size={18} className="sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-graphite-500 mb-1 sm:mb-2">Connect Across Networks</h3>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm font-bold text-graphite-900">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">LinkedIn</a>
                  )}
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a>
                  )}
                  {profile.dribbbleUrl && (
                    <a href={profile.dribbbleUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Dribbble</a>
                  )}
                  {profile.behanceUrl && (
                    <a href={profile.behanceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">Behance</a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-[2.5rem] border border-gray-200/80 shadow-xl shadow-gray-200/40">
            {status === 'success' ? (
              <div className="text-center py-10 sm:py-16">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 text-emerald-600 border border-emerald-100">
                  <CheckCircle2 size={32} className="sm:w-9 sm:h-9" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-graphite-950 mb-2">Inquiry Received</h3>
                <p className="text-xs sm:text-sm text-graphite-600 mb-6 sm:mb-8 max-w-sm mx-auto leading-relaxed">
                  Thank you for reaching out! Your message has been routed to my inbox. I typically respond within 24 hours.
                </p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-6 py-3 bg-graphite-950 text-white text-xs font-bold rounded-xl hover:bg-graphite-800 transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label htmlFor="name" className="block text-xs font-bold uppercase text-graphite-700 mb-1.5">Your Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all font-medium"
                      placeholder="e.g. Alex Morgan"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-xs font-bold uppercase text-graphite-700 mb-1.5">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all font-medium"
                      placeholder="alex@company.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div>
                    <label htmlFor="projectType" className="block text-xs font-bold uppercase text-graphite-700 mb-1.5">Project Scope</label>
                    <select 
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all font-medium"
                    >
                      <option value="Website Design">Website Design</option>
                      <option value="UI/UX Design">UI/UX Design</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Landing Page">Landing Page</option>
                      <option value="Brand Identity">Brand Identity</option>
                      <option value="Mobile App Design">Mobile App Design</option>
                      <option value="Other">Other / Consultation</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-xs font-bold uppercase text-graphite-700 mb-1.5">Estimated Budget</label>
                    <select 
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all font-medium"
                    >
                      <option value="< $1k">Under $1,000</option>
                      <option value="$1k - $3k">$1,000 – $3,000</option>
                      <option value="$3k - $5k">$3,000 – $5,000</option>
                      <option value="$5k - $10k">$5,000 – $10,000</option>
                      <option value="$10k+">$10,000+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-bold uppercase text-graphite-700 mb-1.5">Project Details *</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-3.5 py-3 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all resize-none font-medium leading-relaxed"
                    placeholder="Tell me about your goals, timeline, and key requirements..."
                  ></textarea>
                </div>

                {/* Honeypot field (hidden from humans, trapped for spam bots) */}
                <div className="opacity-0 absolute -left-[9999px] top-0 pointer-events-none" aria-hidden="true" tabIndex={-1}>
                  <label htmlFor="user_company_url">Website URL</label>
                  <input
                    type="text"
                    id="user_company_url"
                    name="user_company_url"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {errorMessage && (
                  <p className="text-red-600 text-xs font-semibold p-3 bg-red-50 rounded-xl border border-red-200/60">
                    {errorMessage}
                  </p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full py-3.5 sm:py-4 bg-graphite-950 text-white text-xs sm:text-sm font-bold rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? 'Sending Inquiry...' : 'Submit Inquiry'}
                  {status !== 'loading' && <ArrowRight size={16} />}
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
