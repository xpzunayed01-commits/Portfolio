import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  ExternalLink, 
  Check, 
  X, 
  Eye,
  Calendar,
  Award
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types';
import { fallbackCertificates } from '@/data';
import { saveCertificate, removeCertificate } from '@/lib/portfolioService';

export function AdminCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issued: '',
    expiration: '',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'certificates'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
        setCertificates(list);
      } else {
        setCertificates(fallbackCertificates);
      }
    }, () => {
      setCertificates(fallbackCertificates);
    });

    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingCert(null);
    setFormData({
      title: '',
      issuer: 'Google Cloud / Coursera',
      issued: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      expiration: '',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (c: Certificate) => {
    setEditingCert(c);
    setFormData({
      title: c.title,
      issuer: c.issuer,
      issued: c.issued,
      expiration: c.expiration || '',
      image: c.image || '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const payload: Partial<Certificate> = {
        title: formData.title,
        issuer: formData.issuer,
        issued: formData.issued,
        expiration: formData.expiration || undefined,
        image: formData.image,
      };

      if (editingCert?.id) {
        payload.id = editingCert.id;
      }

      await saveCertificate(payload);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving certificate: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      setDeletingId(id);
      await removeCertificate(id);
    } catch (err) {
      console.error(err);
      alert('Error deleting certificate: ' + (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout
      title="Certificates & Credentials"
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all"
          >
            <div>
              <div className="aspect-[16/10] bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 relative group">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-graphite-900 leading-snug">
                  {cert.title}
                </h3>
              </div>
              <p className="text-xs font-medium text-graphite-500 mb-4">{cert.issuer}</p>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-graphite-500">
                <span>Issued: <strong className="text-graphite-800 font-semibold">{cert.issued}</strong></span>
                {cert.expiration && (
                  <span>Expires: <strong className="text-graphite-800 font-semibold">{cert.expiration}</strong></span>
                )}
              </div>

              <div className="flex items-center justify-end gap-1 pt-2">
                <button
                  onClick={() => openEditModal(cert)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  disabled={deletingId === cert.id}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-graphite-900">
                {editingCert ? 'Edit Certificate' : 'Add Certificate'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Google AI Essentials"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  placeholder="e.g. Google Cloud / Coursera"
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.issued}
                    onChange={(e) => setFormData({ ...formData, issued: e.target.value })}
                    placeholder="e.g. March 13, 2025"
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Expiration (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.expiration}
                    onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
                    placeholder="e.g. May 2027"
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Certificate Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 text-xs font-semibold text-graphite-600 bg-gray-100 hover:bg-gray-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 text-xs font-bold text-white bg-graphite-900 hover:bg-graphite-800 rounded-xl shadow-xs"
                >
                  {saving ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
