import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  User, 
  Save, 
  Upload, 
  Sparkles, 
  Plus, 
  Trash2, 
  Briefcase, 
  GraduationCap, 
  Link as LinkIcon, 
  Check, 
  Globe,
  Github,
  Linkedin,
  Figma,
  Twitter,
  Instagram,
  Eye,
  Calendar
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ProfileData, TimelineItem } from '@/types';
import { fallbackProfile } from '@/data';
import { saveProfileData } from '@/lib/portfolioService';
import { useToast } from '@/context/ToastContext';

export function AdminProfile() {
  const { toastSuccess, toastError } = useToast();
  const [profile, setProfile] = useState<ProfileData>(fallbackProfile);
  const [activeTab, setActiveTab] = useState<'general' | 'experience' | 'skills' | 'socials'>('general');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteContent', 'profile'), (snap) => {
      if (snap.exists()) {
        setProfile(snap.data() as ProfileData);
      } else {
        setProfile(fallbackProfile);
      }
    }, () => {
      setProfile(fallbackProfile);
    });

    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveProfileData(profile);
      toastSuccess('Profile information saved successfully');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error saving profile');
    } finally {
      setSaving(false);
    }
  };

  // Timeline helpers
  const addExperienceItem = () => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      period: '2024 - Present',
      role: 'Senior UI/UX Designer',
      company: 'Studio / Agency',
      description: 'Designing intuitive user interfaces, design systems, and responsive web platforms.',
      type: 'experience'
    };
    setProfile(prev => ({
      ...prev,
      experience: [...(prev.experience || []), newItem]
    }));
  };

  const removeExperienceItem = (id: string) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).filter(item => item.id !== id)
    }));
  };

  const updateExperienceItem = (id: string, field: keyof TimelineItem, value: string) => {
    setProfile(prev => ({
      ...prev,
      experience: (prev.experience || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addEducationItem = () => {
    const newItem: TimelineItem = {
      id: Date.now().toString(),
      period: '2020 - 2024',
      role: 'B.Sc. in Computer Science',
      company: 'University of Engineering',
      description: 'Specialized in Human-Computer Interaction and Software Engineering.',
      type: 'education'
    };
    setProfile(prev => ({
      ...prev,
      education: [...(prev.education || []), newItem]
    }));
  };

  const removeEducationItem = (id: string) => {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).filter(item => item.id !== id)
    }));
  };

  const updateEducationItem = (id: string, field: keyof TimelineItem, value: string) => {
    setProfile(prev => ({
      ...prev,
      education: (prev.education || []).map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  return (
    <AdminLayout
      title="Profile & Biography"
      subtitle="Manage your personal brand, bio, headline, experience timeline, skills, and social handles."
      actionButton={
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      }
    >
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'general' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          1. General & Bio
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'experience' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          2. Timeline & Career ({ (profile.experience?.length || 0) + (profile.education?.length || 0) })
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'skills' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          3. Skills & Capabilities
        </button>
        <button
          onClick={() => setActiveTab('socials')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'socials' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          4. Socials & Contact
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* TAB 1: General & Bio */}
        {activeTab === 'general' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Avatar & Quick Highlights */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">Avatar & Visuals</h3>
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-100 border-2 border-gray-200 shadow-sm mb-4 relative group">
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Avatar Image URL
                </label>
                <input
                  type="url"
                  value={profile.avatarUrl}
                  onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <label className="block text-xs font-bold text-graphite-700 uppercase">
                  Availability Status
                </label>
                <input
                  type="text"
                  value={profile.availability}
                  onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                  placeholder="e.g. Available for select projects"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />

                <label className="block text-xs font-bold text-graphite-700 uppercase pt-2">
                  Resume / CV Link
                </label>
                <input
                  type="url"
                  value={profile.resumeUrl}
                  onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                  placeholder="https://drive.google.com/... or /resume.pdf"
                  className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>
            </div>

            {/* Right Column: Name, Headline, Bio */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
              <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">Identity & Headlines</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Primary Professional Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Tagline / Brand Statement *
                </label>
                <input
                  type="text"
                  required
                  value={profile.tagline}
                  onChange={(e) => setProfile({ ...profile, tagline: e.target.value })}
                  placeholder="Turning ideas into digital experiences people remember."
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-bold text-graphite-950"
                />
                <p className="text-[11px] text-graphite-400 mt-1">Displayed boldly in the hero and header intros.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Years of Experience
                  </label>
                  <input
                    type="text"
                    value={profile.stats?.experience || '4+'}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      stats: { ...profile.stats, experience: e.target.value } 
                    })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Completed Projects
                  </label>
                  <input
                    type="text"
                    value={profile.stats?.projects || '25+'}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      stats: { ...profile.stats, projects: e.target.value } 
                    })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Happy Clients / Retention
                  </label>
                  <input
                    type="text"
                    value={profile.stats?.clients || '100%'}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      stats: { ...profile.stats, clients: e.target.value } 
                    })}
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  About Me — Section 1 (Core Philosophy)
                </label>
                <textarea
                  rows={3}
                  value={profile.bioParagraph1}
                  onChange={(e) => setProfile({ ...profile, bioParagraph1: e.target.value })}
                  placeholder="I am a multidisciplinary designer and creative developer..."
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  About Me — Section 2 (Approach & Execution)
                </label>
                <textarea
                  rows={3}
                  value={profile.bioParagraph2}
                  onChange={(e) => setProfile({ ...profile, bioParagraph2: e.target.value })}
                  placeholder="My workflow bridges the gap between clean editorial aesthetics and responsive front-end code..."
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Experience & Education */}
        {activeTab === 'experience' && (
          <div className="space-y-6">
            {/* Work Experience */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-graphite-900" />
                  <h3 className="text-sm font-bold text-graphite-950 uppercase">Work Experience</h3>
                </div>
                <button
                  type="button"
                  onClick={addExperienceItem}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-graphite-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {(profile.experience || []).map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Role / Position</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => updateExperienceItem(item.id, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-graphite-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Company / Studio</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateExperienceItem(item.id, 'company', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Duration / Period</label>
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => updateExperienceItem(item.id, 'period', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperienceItem(item.id)}
                          className="mt-4 p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Description & Impact</label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) => updateExperienceItem(item.id, 'description', e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <GraduationCap size={18} className="text-graphite-900" />
                  <h3 className="text-sm font-bold text-graphite-950 uppercase">Education & Degrees</h3>
                </div>
                <button
                  type="button"
                  onClick={addEducationItem}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-graphite-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Education</span>
                </button>
              </div>

              <div className="space-y-4">
                {(profile.education || []).map((item) => (
                  <div key={item.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 relative group">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Degree / Focus</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => updateEducationItem(item.id, 'role', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg font-bold text-graphite-900"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Institution</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateEducationItem(item.id, 'company', e.target.value)}
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold uppercase text-graphite-500 mb-1">Years</label>
                          <input
                            type="text"
                            value={item.period}
                            onChange={(e) => updateEducationItem(item.id, 'period', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeEducationItem(item.id)}
                          className="mt-4 p-2 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Skills & Capabilities */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">Technical & Design Skills</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-2">
                  UI/UX & Design Skills (One per line)
                </label>
                <textarea
                  rows={6}
                  value={profile.skills?.design?.join('\n') || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: {
                      ...profile.skills,
                      design: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  placeholder="Design Systems&#10;Wireframing&#10;Interactive Prototypes&#10;Information Architecture"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-2">
                  Development & Code (One per line)
                </label>
                <textarea
                  rows={6}
                  value={profile.skills?.development?.join('\n') || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: {
                      ...profile.skills,
                      development: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  placeholder="React&#10;TypeScript&#10;Tailwind CSS&#10;Next.js&#10;Vite"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-2">
                  Tools & Workflows (One per line)
                </label>
                <textarea
                  rows={6}
                  value={profile.skills?.tools?.join('\n') || ''}
                  onChange={(e) => setProfile({
                    ...profile,
                    skills: {
                      ...profile.skills,
                      tools: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                    }
                  })}
                  placeholder="Figma&#10;Git / GitHub&#10;VS Code&#10;Adobe CC"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Socials & Contact Info */}
        {activeTab === 'socials' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">Contact Details & Social Media</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Public Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="hello@zunayed.me"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Location / City
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="Dhaka, Bangladesh · Remote Worldwide"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  GitHub Profile URL
                </label>
                <input
                  type="url"
                  value={profile.socials?.github || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, github: e.target.value } 
                  })}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  type="url"
                  value={profile.socials?.linkedin || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, linkedin: e.target.value } 
                  })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Figma Community / Profile
                </label>
                <input
                  type="url"
                  value={profile.socials?.figma || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, figma: e.target.value } 
                  })}
                  placeholder="https://figma.com/@username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Dribbble / Behance
                </label>
                <input
                  type="url"
                  value={profile.socials?.dribbble || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, dribbble: e.target.value } 
                  })}
                  placeholder="https://dribbble.com/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Twitter / X URL
                </label>
                <input
                  type="url"
                  value={profile.socials?.twitter || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, twitter: e.target.value } 
                  })}
                  placeholder="https://x.com/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={profile.socials?.instagram || ''}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    socials: { ...profile.socials, instagram: e.target.value } 
                  })}
                  placeholder="https://instagram.com/username"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </AdminLayout>
  );
}
