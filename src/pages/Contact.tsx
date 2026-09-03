import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'Website',
    budget: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      await addDoc(collection(db, 'contactMessages'), {
        ...formData,
        status: 'unread',
        createdAt: serverTimestamp()
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', projectType: 'Website', budget: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl"
        >
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-graphite-900 mb-6 leading-tight">
            Have an idea?<br />Let's build it.
          </h1>
          <p className="text-lg text-graphite-600 mb-12">
            Whether you need a website, a digital product, a visual identity, or simply want to discuss an idea, I'd love to hear what you're working on.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-2">Email</h3>
              <a href="mailto:hello@example.com" className="text-lg font-medium text-graphite-900 hover:opacity-70 transition-opacity">hello@example.com</a>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-2">Location</h3>
              <p className="text-lg font-medium text-graphite-900">Available Worldwide (Remote)</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-graphite-500 mb-2">Socials</h3>
              <div className="flex gap-6">
                <a href="#" className="text-lg font-medium text-graphite-900 hover:opacity-70 transition-opacity">LinkedIn</a>
                <a href="#" className="text-lg font-medium text-graphite-900 hover:opacity-70 transition-opacity">GitHub</a>
                <a href="#" className="text-lg font-medium text-graphite-900 hover:opacity-70 transition-opacity">Twitter</a>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
            {status === 'success' ? (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-3xl font-semibold text-graphite-900 mb-4">Message Sent</h3>
                <p className="text-graphite-600 mb-8">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                <button 
                  onClick={() => setStatus('idle')}
                  className="px-8 py-4 bg-graphite-900 text-white font-medium rounded-full hover:bg-graphite-800 transition-colors"
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-graphite-900 mb-2">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-paper border border-gray-200 focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-graphite-900 mb-2">Email</label>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-paper border border-gray-200 focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="projectType" className="block text-sm font-medium text-graphite-900 mb-2">Project Type</label>
                    <select 
                      id="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-paper border border-gray-200 focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all appearance-none"
                    >
                      <option>Website</option>
                      <option>UI/UX Design</option>
                      <option>Web Development</option>
                      <option>Landing Page</option>
                      <option>Logo / Branding</option>
                      <option>Graphic Design</option>
                      <option>App</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block text-sm font-medium text-graphite-900 mb-2">Budget Range (Optional)</label>
                    <select 
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({...formData, budget: e.target.value})}
                      className="w-full px-5 py-4 rounded-xl bg-paper border border-gray-200 focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all appearance-none"
                    >
                      <option value="">Select Range</option>
                      <option value="<1k">Under $1k</option>
                      <option value="1k-5k">$1k - $5k</option>
                      <option value="5k-10k">$5k - $10k</option>
                      <option value="10k+">$10k+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-graphite-900 mb-2">Message</label>
                  <textarea 
                    id="message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-5 py-4 rounded-xl bg-paper border border-gray-200 focus:outline-none focus:border-graphite-900 focus:ring-1 focus:ring-graphite-900 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm">Failed to send message. Please ensure Supabase is configured or try again.</p>
                )}

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-graphite-900 text-white font-medium rounded-xl hover:bg-graphite-800 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                  {status !== 'loading' && <ArrowRight size={18} />}
                </button>
              </form>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
