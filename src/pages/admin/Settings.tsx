import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Settings as SettingsIcon, 
  Save, 
  ShieldCheck, 
  KeyRound, 
  Database, 
  Globe, 
  Download, 
  RefreshCw, 
  Check, 
  AlertTriangle,
  UserPlus,
  Trash2,
  Lock,
  Mail
} from 'lucide-react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { sendPasswordResetEmail } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { SiteSettings } from '@/types';
import { fallbackSettings } from '@/data';
import { 
  saveSiteSettings, 
  seedFirestoreWithDefaults, 
  exportAllDataAsJSON 
} from '@/lib/portfolioService';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { useToast } from '@/context/ToastContext';

export function AdminSettings() {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(fallbackSettings);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'database'>('general');
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Modals & Confirmation
  const [confirmSeedOpen, setConfirmSeedOpen] = useState(false);
  const [resetEmailSending, setResetEmailSending] = useState(false);

  // New admin email input
  const [newAdminEmail, setNewAdminEmail] = useState('');

  const currentUser = auth.currentUser;

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'siteContent', 'settings'), (snap) => {
      if (snap.exists()) {
        setSettings(snap.data() as SiteSettings);
      } else {
        setSettings(fallbackSettings);
      }
    }, () => {
      setSettings(fallbackSettings);
    });

    return () => unsub();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      setSaving(true);
      await saveSiteSettings(settings);
      toastSuccess('Site settings saved');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      await seedFirestoreWithDefaults();
      setConfirmSeedOpen(false);
      toastSuccess('Firestore successfully seeded with portfolio defaults');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error seeding data');
    } finally {
      setSeeding(false);
    }
  };

  const handleExportJSON = async () => {
    try {
      toastInfo('Generating complete portfolio backup...');
      const data = await exportAllDataAsJSON();
      const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
      const objectUrl = URL.createObjectURL(jsonBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = objectUrl;
      downloadAnchor.download = `portfolio-backup-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(objectUrl);
      toastSuccess('Backup JSON exported successfully');
    } catch (err: any) {
      console.error(err);
      toastError('Failed to export backup');
    }
  };

  const handleSendPasswordReset = async () => {
    if (!currentUser?.email) {
      toastError('No current logged in admin email found');
      return;
    }
    try {
      setResetEmailSending(true);
      await sendPasswordResetEmail(auth, currentUser.email);
      toastSuccess(`Password reset email sent to ${currentUser.email}`);
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Failed to send password reset');
    } finally {
      setResetEmailSending(false);
    }
  };

  const addAdminEmail = () => {
    if (!newAdminEmail.trim()) return;
    const email = newAdminEmail.trim().toLowerCase();
    if (!settings.authorizedAdmins?.includes(email)) {
      setSettings(prev => ({
        ...prev,
        authorizedAdmins: [...(prev.authorizedAdmins || []), email]
      }));
      setNewAdminEmail('');
      toastSuccess(`Added ${email} to authorized admin list (Click Save Changes to persist)`);
    } else {
      toastInfo('Email already in list');
    }
  };

  const removeAdminEmail = (emailToRemove: string) => {
    setSettings(prev => ({
      ...prev,
      authorizedAdmins: (prev.authorizedAdmins || []).filter(e => e !== emailToRemove)
    }));
    toastInfo(`Removed ${emailToRemove} (Click Save Changes to persist)`);
  };

  return (
    <AdminLayout
      title="System Settings"
      subtitle="Configure global SEO meta tags, brand details, admin authorization, and database backups."
      actionButton={
        <button
          onClick={() => handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer"
        >
          <Save size={16} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
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
          1. General & SEO
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'security' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          2. Security & Admins
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'database' ? 'bg-graphite-950 text-white shadow-xs' : 'bg-white text-graphite-600 hover:bg-gray-100'
          }`}
        >
          3. Database & Backups
        </button>
      </div>

      <div className="space-y-6">
        {/* TAB 1: General & SEO */}
        {activeTab === 'general' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">SEO & Site Identity</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Site Name / Title Tag *
                </label>
                <input
                  type="text"
                  required
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Primary Contact Email
                </label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="hello@zunayed.me"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                Meta Description (Search Engines & Social Sharing)
              </label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })}
                placeholder="Personal portfolio of Zunayed Al Hasan - UI/UX Designer & Creative Developer..."
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                Footer Copyright Text
              </label>
              <input
                type="text"
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                placeholder="© 2025 Zunayed Al Hasan. All rights reserved."
                className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="text-xs font-bold text-graphite-900">Enable Contact Inquiries Form</p>
                <p className="text-[11px] text-graphite-500">Allow prospective clients to submit messages on /contact</p>
              </div>
              <input
                type="checkbox"
                checked={settings.allowMessages !== false}
                onChange={(e) => setSettings({ ...settings, allowMessages: e.target.checked })}
                className="w-5 h-5 text-graphite-950 rounded border-gray-300 focus:ring-graphite-950 cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* TAB 2: Security & Admins */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* Current Session */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-graphite-950">Active Administrator Session</h3>
                  <p className="text-xs text-graphite-500">
                    Logged in as: <strong className="text-graphite-900">{currentUser?.email || 'Admin'}</strong>
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 text-[11px] font-mono text-graphite-600 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <span>UID: {currentUser?.uid || 'Unknown'}</span>
                <span className="text-emerald-700 font-bold">● Authenticated with Firebase Auth</span>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleSendPasswordReset}
                  disabled={resetEmailSending}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-graphite-900 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  <Mail size={14} />
                  <span>{resetEmailSending ? 'Sending Email...' : 'Send Password Reset Email'}</span>
                </button>
              </div>
            </div>

            {/* Authorized Admin Emails */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-graphite-950 uppercase">Authorized Admin Emails</h3>
                  <p className="text-xs text-graphite-500">Only emails listed here or registered in Firebase Auth can manage portfolio content</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="flex-1 px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
                <button
                  type="button"
                  onClick={addAdminEmail}
                  className="px-4 py-2 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus size={14} />
                  <span>Add Admin</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                {(settings.authorizedAdmins || ['admin@zunayed.me']).map((email) => (
                  <div
                    key={email}
                    className="flex items-center justify-between px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-xs"
                  >
                    <span className="font-semibold text-graphite-900">{email}</span>
                    <button
                      type="button"
                      onClick={() => removeAdminEmail(email)}
                      className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Database & Backups */}
        {activeTab === 'database' && (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-graphite-950 uppercase tracking-wider">Cloud Firestore Operations</h3>

            {/* Export JSON Backup */}
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-graphite-950 flex items-center gap-2">
                  <Download size={16} />
                  <span>Export JSON Backup</span>
                </h4>
                <p className="text-xs text-graphite-500 mt-0.5">
                  Download an offline `.json` snapshot of all projects, services, certificates, and site content.
                </p>
              </div>
              <button
                type="button"
                onClick={handleExportJSON}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-graphite-900 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                <Download size={14} />
                <span>Export JSON</span>
              </button>
            </div>

            {/* Seed / Reset Default Data */}
            <div className="p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-amber-950 flex items-center gap-2">
                  <RefreshCw size={16} />
                  <span>Seed Default Portfolio Data</span>
                </h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  Populate your Firestore collections with default projects, services, and profile information.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmSeedOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-amber-950 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>Seed Firestore</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Seed Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmSeedOpen}
        title="Seed Default Data into Firestore?"
        message="This will write default projects, services, certificates, and profile documents to your Cloud Firestore database."
        confirmLabel="Seed Database"
        isDestructive={false}
        isLoading={seeding}
        onConfirm={handleSeedData}
        onCancel={() => setConfirmSeedOpen(false)}
      />
    </AdminLayout>
  );
}
