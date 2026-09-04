import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  Database, 
  Check, 
  AlertCircle, 
  Globe, 
  Image as ImageIcon 
} from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  defaultSettings, 
  saveSettings, 
  seedFirestoreWithDefaults, 
  SiteSettings 
} from '@/lib/portfolioService';

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      if (snap.exists()) {
        setSettings({ ...defaultSettings, ...snap.data() } as SiteSettings);
      }
    }, () => {
      setSettings(defaultSettings);
    });

    return () => unsub();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await saveSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error updating settings: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSeed = async () => {
    if (!confirm('This will seed/refresh the Firestore database with initial sample projects, services, certificates, and profile. Continue?')) {
      return;
    }
    try {
      setSeeding(true);
      await seedFirestoreWithDefaults();
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (err) {
      console.error(err);
      alert('Error seeding database: ' + (err as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <AdminLayout
      title="Site Settings & System"
      actionButton={
        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
        >
          {saveSuccess ? <Check size={16} className="text-green-400" /> : <Save size={16} />}
          <span>{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Settings'}</span>
        </button>
      }
    >
      <div className="space-y-8">
        {/* Branding & Visual Assets */}
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
            <div className="p-2.5 bg-gray-100 rounded-xl text-graphite-900">
              <ImageIcon size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-graphite-900">Brand Identity & Logo</h2>
              <p className="text-xs text-graphite-500">Manage site logo, favicon, and brand metadata</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Site Name / Title
              </label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Logo Text Label
              </label>
              <input
                type="text"
                value={settings.logoText}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Logo Image URL (Geometric Monogram)
              </label>
              <div className="flex gap-4 items-center">
                <input
                  type="url"
                  required
                  value={settings.logoImageUrl}
                  onChange={(e) => setSettings({ ...settings, logoImageUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-xs"
                />
                <div className="w-10 h-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  <img src={settings.logoImageUrl} alt="Logo Preview" className="w-8 h-8 object-contain" />
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1.5">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>
          </div>
        </form>

        {/* Database Sync / Initializer */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-100 mb-6">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-graphite-900">Database & Content Initialization</h2>
              <p className="text-xs text-graphite-500">Seed default project showcases, services, and credentials to Firestore</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50 rounded-xl border border-gray-200/60">
            <div>
              <h4 className="text-sm font-bold text-graphite-900">Seed Initial Portfolio Data</h4>
              <p className="text-xs text-graphite-600 mt-0.5">
                Populates all 6 projects, 4 services, and 3 verified certificates into your live Firestore collections.
              </p>
            </div>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-graphite-800 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-2xs shrink-0"
            >
              <RefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
              <span>{seeding ? 'Syncing to Firestore...' : seedSuccess ? 'Database Seeded!' : 'Seed Firestore Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
