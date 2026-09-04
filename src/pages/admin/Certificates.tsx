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
  Copy,
  Search,
  CheckCircle2,
  CircleDashed,
  Award,
  Calendar,
  ShieldCheck
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Certificate } from '@/types';
import { fallbackCertificates } from '@/data';
import { 
  saveCertificate, 
  removeCertificate, 
  duplicateCertificate 
} from '@/lib/portfolioService';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';
import { useToast } from '@/context/ToastContext';

export function AdminCertificates() {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [saving, setSaving] = useState(false);

  // Deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [certToDelete, setCertToDelete] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    issuer: '',
    issued: '',
    expiration: '',
    certificateId: '',
    verificationUrl: '',
    description: '',
    image: '',
    published: true,
    order: 1,
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
      certificateId: 'GCC-' + Math.floor(100000 + Math.random() * 900000),
      verificationUrl: 'https://coursera.org/verify/',
      description: 'Professional specialization certification covering modern design systems, user research, and interface ergonomics.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2070',
      published: true,
      order: certificates.length + 1,
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
      certificateId: c.certificateId || '',
      verificationUrl: c.verificationUrl || '',
      description: c.description || '',
      image: c.image || '',
      published: c.published !== undefined ? c.published : true,
      order: c.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Certificate title is required');
      return;
    }

    try {
      setSaving(true);
      const payload: Partial<Certificate> = {
        title: formData.title.trim(),
        issuer: formData.issuer.trim(),
        issued: formData.issued.trim(),
        expiration: formData.expiration.trim() || undefined,
        certificateId: formData.certificateId.trim() || undefined,
        verificationUrl: formData.verificationUrl.trim() || undefined,
        description: formData.description.trim() || undefined,
        image: formData.image.trim(),
        published: formData.published,
        order: Number(formData.order) || 1,
      };

      if (editingCert?.id) {
        payload.id = editingCert.id;
      }

      await saveCertificate(payload);
      setIsModalOpen(false);
      toastSuccess(editingCert ? 'Certificate updated' : 'New certificate added');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error saving certificate');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (c: Certificate) => {
    try {
      toastInfo(`Duplicating "${c.title}"...`);
      await duplicateCertificate(c);
      toastSuccess('Certificate duplicated');
    } catch (err: any) {
      console.error(err);
      toastError('Error duplicating certificate');
    }
  };

  const togglePublished = async (c: Certificate) => {
    try {
      const next = c.published === false ? true : false;
      await saveCertificate({
        ...c,
        published: next
      });
      toastSuccess(`Certificate ${next ? 'published' : 'moved to draft'}`);
    } catch (err: any) {
      console.error(err);
      toastError('Failed to toggle status');
    }
  };

  const triggerDelete = (c: Certificate) => {
    setCertToDelete(c);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!certToDelete) return;
    try {
      setDeleting(true);
      await removeCertificate(certToDelete.id);
      setConfirmOpen(false);
      setCertToDelete(null);
      toastSuccess('Certificate deleted successfully');
    } catch (err: any) {
      console.error(err);
      toastError('Error deleting certificate');
    } finally {
      setDeleting(false);
    }
  };

  const filteredCertificates = certificates.filter(c => {
    const q = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.issuer.toLowerCase().includes(q) ||
      (c.certificateId && c.certificateId.toLowerCase().includes(q))
    );
  });

  return (
    <AdminLayout
      title="Certificates & Credentials"
      subtitle="Manage your certified credentials, issuing institutions, and verification badges."
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add Certificate</span>
        </button>
      }
    >
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search certificates or issuer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 transition-all"
          />
        </div>
        <div className="text-xs font-semibold text-graphite-500">
          Total Credentials: <strong className="text-graphite-900">{certificates.length}</strong>
        </div>
      </div>

      {filteredCertificates.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certificates found"
          description="Add your first verified credential or adjust your search filter."
          actionLabel="Add Certificate"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => {
            const isPub = cert.published !== false;
            return (
              <div
                key={cert.id}
                className="bg-white rounded-2xl border border-gray-200/80 p-5 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all group"
              >
                <div>
                  <div className="aspect-[16/10] bg-gray-50 rounded-xl overflow-hidden mb-4 border border-gray-100 relative group/img shadow-2xs">
                    <img
                      src={cert.image}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => togglePublished(cert)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md shadow-xs transition-all cursor-pointer ${
                          isPub 
                            ? 'bg-emerald-500/90 text-white' 
                            : 'bg-graphite-900/80 text-white'
                        }`}
                      >
                        {isPub ? <CheckCircle2 size={10} /> : <CircleDashed size={10} />}
                        <span>{isPub ? 'Published' : 'Draft'}</span>
                      </button>
                    </div>
                  </div>

                  <div className="mb-2">
                    <h3 className="text-base font-bold text-graphite-950 leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-semibold text-graphite-500 mt-0.5">{cert.issuer}</p>
                  </div>

                  {cert.description && (
                    <p className="text-xs text-graphite-600 line-clamp-2 leading-relaxed mb-3">
                      {cert.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-graphite-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Issued: <strong className="text-graphite-800">{cert.issued}</strong></span>
                    </span>
                    {cert.expiration && (
                      <span>Expires: <strong className="text-graphite-800">{cert.expiration}</strong></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100/60">
                    {cert.verificationUrl ? (
                      <a
                        href={cert.verificationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>Verify Credential</span>
                        <ExternalLink size={11} />
                      </a>
                    ) : (
                      <span className="text-[11px] text-gray-400">ID: {cert.certificateId || 'Standard'}</span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDuplicate(cert)}
                        className="p-1.5 text-gray-400 hover:text-graphite-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Duplicate"
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        onClick={() => openEditModal(cert)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Edit3 size={15} />
                      </button>
                      <button
                        onClick={() => triggerDelete(cert)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl my-8 relative border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-xl font-bold text-graphite-950">
                  {editingCert ? 'Edit Certificate' : 'Add New Certificate'}
                </h2>
                <p className="text-xs text-graphite-500">Add credentials and verification link</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
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
                  placeholder="e.g. Google UX Design Certificate"
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-bold"
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
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
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
                    placeholder="e.g. March 2025"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiration}
                    onChange={(e) => setFormData({ ...formData, expiration: e.target.value })}
                    placeholder="e.g. Lifetime / No Expiration"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Certificate ID
                  </label>
                  <input
                    type="text"
                    value={formData.certificateId}
                    onChange={(e) => setFormData({ ...formData, certificateId: e.target.value })}
                    placeholder="e.g. GCC-948271"
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Verification URL
                  </label>
                  <input
                    type="url"
                    value={formData.verificationUrl}
                    onChange={(e) => setFormData({ ...formData, verificationUrl: e.target.value })}
                    placeholder="https://coursera.org/verify/..."
                    className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
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
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                />
                {formData.image && (
                  <div className="mt-2 w-full h-28 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Description / Topics Covered
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief note on key skills demonstrated..."
                  className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <p className="text-xs font-bold text-graphite-900">Publish to Portfolio</p>
                  <p className="text-[11px] text-graphite-500">Show this credential on the public certificates showcase.</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-5 h-5 text-graphite-950 rounded border-gray-300 focus:ring-graphite-950 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-graphite-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-graphite-950 hover:bg-graphite-800 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingCert ? 'Update Certificate' : 'Save Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Certificate?"
        message={`Are you sure you want to delete "${certToDelete?.title}"? This credential will be removed from your public portfolio.`}
        confirmLabel="Delete"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setCertToDelete(null);
        }}
      />
    </AdminLayout>
  );
}
