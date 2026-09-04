import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Layers, 
  Monitor, 
  Code, 
  Sparkles, 
  Palette, 
  Check, 
  X,
  PlusCircle
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service } from '@/types';
import { fallbackServices } from '@/data';
import { saveService, removeService } from '@/lib/portfolioService';

const AVAILABLE_ICONS = ['Monitor', 'Layers', 'Code', 'Sparkles', 'Palette'];

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={20} />,
  Layers: <Layers size={20} />,
  Code: <Code size={20} />,
  Sparkles: <Sparkles size={20} />,
  Palette: <Palette size={20} />,
};

export function AdminServices() {
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    number: '01',
    shortDescription: '',
    deliverables: 'Wireframes\nHigh-Fidelity Mockups\nInteractive Prototypes\nDesign Systems',
    icon: 'Monitor',
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Service));
        setServices(list);
      } else {
        setServices(fallbackServices);
      }
    }, () => {
      setServices(fallbackServices);
    });

    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingService(null);
    const nextNum = (services.length + 1).toString().padStart(2, '0');
    setFormData({
      title: '',
      slug: '',
      number: nextNum,
      shortDescription: '',
      deliverables: 'Deliverable 1\nDeliverable 2\nDeliverable 3',
      icon: 'Monitor',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setFormData({
      title: s.title,
      slug: s.slug,
      number: s.number,
      shortDescription: s.shortDescription,
      deliverables: s.deliverables.join('\n'),
      icon: s.icon || 'Monitor',
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingService ? prev.slug : autoSlug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const delivArray = formData.deliverables
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean);

      const servicePayload: Partial<Service> & { slug: string } = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        number: formData.number,
        shortDescription: formData.shortDescription,
        deliverables: delivArray,
        icon: formData.icon,
      };

      if (editingService?.id) {
        servicePayload.id = editingService.id;
      }

      await saveService(servicePayload);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving service: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this service?')) return;
    try {
      setDeletingId(id);
      await removeService(id);
    } catch (err) {
      console.error(err);
      alert('Error deleting service: ' + (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout
      title="Services Management"
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service) => (
          <div
            key={service.id || service.slug}
            className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl text-graphite-900 border border-gray-100">
                    {iconMap[service.icon] || <Sparkles size={20} />}
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-graphite-400">
                      SERVICE #{service.number}
                    </span>
                    <h3 className="text-lg font-bold text-graphite-900">{service.title}</h3>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(service)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(service.id || service.slug)}
                    disabled={deletingId === (service.id || service.slug)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-xs text-graphite-600 leading-relaxed mb-6">
                {service.shortDescription}
              </p>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                <p className="text-[11px] font-bold text-graphite-500 uppercase tracking-wider mb-2">
                  Deliverables ({service.deliverables?.length || 0})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.deliverables?.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 bg-white border border-gray-200/60 rounded-md text-xs font-medium text-graphite-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-graphite-400">
              <span className="font-mono">slug: /services/{service.slug}</span>
              <a
                href={`/services/${service.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-graphite-700 hover:underline"
              >
                View Service Page →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-graphite-900">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. UI/UX Design"
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Number
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    placeholder="01"
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  >
                    {AVAILABLE_ICONS.map(ic => (
                      <option key={ic} value={ic}>{ic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Overview of the service offering..."
                  className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Deliverables (One per line)
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="Wireframes&#10;Mockups&#10;Design Systems"
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
                  {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
