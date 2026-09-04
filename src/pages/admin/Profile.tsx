import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  User, 
  Save, 
  Sparkles, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Linkedin, 
  Check, 
  Globe,
  ExternalLink,
  FileText
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { defaultProfile, saveProfile, SiteProfile } from '@/lib/portfolioService';

export function AdminProfile() {
  const [profile, setProfile] = useState<SiteProfile>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'profile', 'main'), (snap) => {
      if (snap.exists()) {
        setProfile({ ...defaultProfile, ...snap.data() } as SiteProfile);
      }
    }, () => {
      setProfile(defaultProfile);
    });

    return () => unsub();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveProfile(profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error updating profile: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Profile & Bio Management"
      actionButton={
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
        >
          {success ? <Check size={16} className="text-green-400" /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : success ? 'Saved Successfully!' : 'Save Changes'}</span>
        </button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Details */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
            <div className="p-2.5 bg-gray-100 rounded-xl text-graphite-900">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-graphite-900">Personal & Brand Information</h2>
              <p className="text-xs text-graphite-500">Your core identity displayed across the portfolio</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Professional Title
              </label>
              <input
                type="text"
                required
                value={profile.professionalTitle}
                onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Tagline / Eyebrow
              </label>
              <input
                type="text"
                value={profile.tagline}
                onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                value={profile.availabilityStatus}
                onChange={(e) => setProfile({ ...profile, availabilityStatus: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                required
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Location & Work Preference
              </label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>
          </div>
        </div>

        {/* Hero & Bio Story */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
            <div className="p-2.5 bg-gray-100 rounded-xl text-graphite-900">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-graphite-900">Hero Headline & Narrative Bio</h2>
              <p className="text-xs text-graphite-500">The primary story copy displayed on Home and About pages</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Hero Main Headline *
              </label>
              <input
                type="text"
                required
                value={profile.heroHeadline}
                onChange={(e) => setProfile({ ...profile, heroHeadline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Hero Subtitle / Description
              </label>
              <textarea
                rows={2}
                value={profile.heroSubtitle}
                onChange={(e) => setProfile({ ...profile, heroSubtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                About Page Full Biography
              </label>
              <textarea
                rows={4}
                value={profile.aboutBio}
                onChange={(e) => setProfile({ ...profile, aboutBio: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>
          </div>
        </div>

        {/* Social & Professional Links */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
            <div className="p-2.5 bg-gray-100 rounded-xl text-graphite-900">
              <Globe size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-graphite-900">Social Media & Portals</h2>
              <p className="text-xs text-graphite-500">Links rendered in footer and contact channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.githubUrl}
                onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedinUrl}
                onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Behance URL
              </label>
              <input
                type="url"
                value={profile.behanceUrl || ''}
                onChange={(e) => setProfile({ ...profile, behanceUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Dribbble URL
              </label>
              <input
                type="url"
                value={profile.dribbbleUrl || ''}
                onChange={(e) => setProfile({ ...profile, dribbbleUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-xs"
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
