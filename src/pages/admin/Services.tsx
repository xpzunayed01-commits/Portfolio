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
  Smartphone,
  Globe,
  Layout,
  Check, 
  X,
  Copy,
  Eye,
  CheckCircle2,
  CircleDashed,
  HelpCircle,
  ListOrdered
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Service, ServiceProcessStep, ServiceFAQ } from '@/types';
import { fallbackServices } from '@/data';
import { 
  saveService, 
  removeService, 
  duplicateService 
} from '@/lib/portfolioService';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';
import { useToast } from '@/context/ToastContext';

const AVAILABLE_ICONS = [
  'Monitor', 
  'Layers', 
  'Code', 
  'Sparkles', 
  'Palette', 
  'Smartphone', 
  'Globe', 
  'Layout'
];

const iconMap: Record<string, React.ReactNode> = {
  Monitor: <Monitor size={20} />,
  Layers: <Layers size={20} />,
  Code: <Code size={20} />,
  Sparkles: <Sparkles size={20} />,
  Palette: <Palette size={20} />,
  Smartphone: <Smartphone size={20} />,
  Globe: <Globe size={20} />,
  Layout: <Layout size={20} />,
};

export function AdminServices() {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'overview' | 'deliverables' | 'process' | 'faqs'>('overview');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [saving, setSaving] = useState(false);

  // Deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    number: '01',
    icon: 'Monitor',
    shortDescription: '',
    fullDescription: '',
    deliverables: 'Wireframing\nUI/UX Design\nInteractive Prototyping\nDesign Systems',
    tools: 'Figma, Adobe Creative Suite, Tailwind CSS',
    process: [
      { step: '01', title: 'Discovery & Research', description: 'Understanding project goals, audience, and market landscape.' },
      { step: '02', title: 'Wireframing & Architecture', description: 'Creating clear structural layouts and information hierarchy.' },
      { step: '03', title: 'High-Fidelity UI Design', description: 'Crafting polished, consistent visual systems with typography and color.' },
      { step: '04', title: 'Prototyping & Testing', description: 'Validating micro-interactions and usability across breakpoints.' }
    ] as ServiceProcessStep[],
    faqs: [
      { question: 'What is the typical turnaround time?', answer: 'Most design sprints take between 1 to 3 weeks depending on the scope.' },
      { question: 'What deliverables are included?', answer: 'You will receive production-ready Figma source files, design system tokens, and exported assets.' }
    ] as ServiceFAQ[],
    published: true,
    order: 1,
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
    setModalTab('overview');
    const nextNum = (services.length + 1).toString().padStart(2, '0');
    setFormData({
      title: '',
      slug: '',
      number: nextNum,
      icon: 'Monitor',
      shortDescription: '',
      fullDescription: '',
      deliverables: 'Wireframing\nUI/UX Design\nInteractive Prototyping\nDesign Systems',
      tools: 'Figma, Tailwind CSS, React',
      process: [
        { step: '01', title: 'Discovery & Research', description: 'Understanding project goals and requirements.' },
        { step: '02', title: 'Architecture & Wireframing', description: 'Mapping out user journeys and structural hierarchy.' },
        { step: '03', title: 'Visual & System Design', description: 'Creating cohesive UI components and typography tokens.' },
        { step: '04', title: 'Handoff & Implementation', description: 'Delivering pixel-perfect assets and specifications.' }
      ],
      faqs: [
        { question: 'What deliverables are provided?', answer: 'Full design systems, Figma components, interactive prototypes, and production assets.' }
      ],
      published: true,
      order: services.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (s: Service) => {
    setEditingService(s);
    setModalTab('overview');
    setFormData({
      title: s.title,
      slug: s.slug,
      number: s.number,
      icon: s.icon || 'Monitor',
      shortDescription: s.shortDescription || '',
      fullDescription: s.fullDescription || '',
      deliverables: Array.isArray(s.deliverables) ? s.deliverables.join('\n') : '',
      tools: Array.isArray(s.tools) ? s.tools.join(', ') : 'Figma, React, Tailwind CSS',
      process: s.process && s.process.length > 0 ? s.process : [
        { step: '01', title: 'Discovery', description: 'Research and requirements gathering.' },
        { step: '02', title: 'Design & Execution', description: 'Iterative high-fidelity execution.' }
      ],
      faqs: s.faqs && s.faqs.length > 0 ? s.faqs : [
        { question: 'How do we collaborate?', answer: 'Direct communication via Slack, Google Meet, or Email with weekly sprint updates.' }
      ],
      published: s.published !== undefined ? s.published : true,
      order: s.order || 1,
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
    if (!formData.title.trim()) {
      toastError('Service title is required');
      return;
    }

    try {
      setSaving(true);
      const delivArray = formData.deliverables
        .split('\n')
        .map(d => d.trim())
        .filter(Boolean);

      const toolsArray = formData.tools
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const servicePayload: Partial<Service> & { slug: string } = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        number: formData.number,
        icon: formData.icon,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription || formData.shortDescription,
        deliverables: delivArray,
        tools: toolsArray,
        process: formData.process,
        faqs: formData.faqs,
        published: formData.published,
        order: Number(formData.order) || 1,
      };

      if (editingService?.id) {
        servicePayload.id = editingService.id;
      }

      await saveService(servicePayload);
      setIsModalOpen(false);
      toastSuccess(editingService ? 'Service updated successfully' : 'New service offering published');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error saving service');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (s: Service) => {
    try {
      toastInfo(`Duplicating "${s.title}"...`);
      await duplicateService(s);
      toastSuccess('Service duplicated as draft');
    } catch (err: any) {
      console.error(err);
      toastError('Error duplicating service');
    }
  };

  const togglePublished = async (s: Service) => {
    try {
      const next = s.published === false ? true : false;
      await saveService({
        ...s,
        published: next
      });
      toastSuccess(`Service ${next ? 'published' : 'moved to draft'}`);
    } catch (err: any) {
      console.error(err);
      toastError('Failed to toggle status');
    }
  };

  const triggerDelete = (s: Service) => {
    setServiceToDelete(s);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!serviceToDelete) return;
    try {
      setDeleting(true);
      await removeService(serviceToDelete.id || serviceToDelete.slug);
      setConfirmOpen(false);
      setServiceToDelete(null);
      toastSuccess('Service deleted successfully');
    } catch (err: any) {
      console.error(err);
      toastError('Error deleting service');
    } finally {
      setDeleting(false);
    }
  };

  // Process Step Helpers
  const addProcessStep = () => {
    const nextStepNum = (formData.process.length + 1).toString().padStart(2, '0');
    setFormData(prev => ({
      ...prev,
      process: [...prev.process, { step: nextStepNum, title: 'New Step', description: 'Step description...' }]
    }));
  };

  const updateProcessStep = (index: number, field: 'title' | 'description', value: string) => {
    const next = [...formData.process];
    next[index][field] = value;
    setFormData(prev => ({ ...prev, process: next }));
  };

  const removeProcessStep = (index: number) => {
    setFormData(prev => ({
      ...prev,
      process: prev.process.filter((_, i) => i !== index)
    }));
  };

  // FAQ Helpers
  const addFAQ = () => {
    setFormData(prev => ({
      ...prev,
      faqs: [...prev.faqs, { question: 'New Question?', answer: 'Answer here...' }]
    }));
  };

  const updateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    const next = [...formData.faqs];
    next[index][field] = value;
    setFormData(prev => ({ ...prev, faqs: next }));
  };

  const removeFAQ = (index: number) => {
    setFormData(prev => ({
      ...prev,
      faqs: prev.faqs.filter((_, i) => i !== index)
    }));
  };

  return (
    <AdminLayout
      title="Services Management"
      subtitle="Manage the capabilities, deliverables, process steps, and FAQs displayed across your portfolio."
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Service</span>
        </button>
      }
    >
      {services.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No services configured"
          description="Create your first client service offering or seed default templates."
          actionLabel="Add Service"
          onAction={openCreateModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => {
            const isPub = service.published !== false;
            return (
              <div
                key={service.id || service.slug}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl text-graphite-900 border border-gray-100 shadow-2xs">
                        {iconMap[service.icon] || <Sparkles size={20} />}
                      </div>
                      <div>
                        <span className="text-[11px] font-mono font-bold text-graphite-400 uppercase">
                          SERVICE #{service.number}
                        </span>
                        <h3 className="text-lg font-bold text-graphite-950 leading-tight">{service.title}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => togglePublished(service)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                          isPub 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title="Toggle Published / Draft"
                      >
                        {isPub ? <CheckCircle2 size={12} className="text-emerald-600" /> : <CircleDashed size={12} />}
                        <span>{isPub ? 'Published' : 'Draft'}</span>
                      </button>
                      <button
                        onClick={() => handleDuplicate(service)}
                        className="p-1.5 text-gray-400 hover:text-graphite-900 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Duplicate Service"
                      >
                        <Copy size={16} />
                      </button>
                      <button
                        onClick={() => openEditModal(service)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Service"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button
                        onClick={() => triggerDelete(service)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Service"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-graphite-600 leading-relaxed mb-5">
                    {service.shortDescription}
                  </p>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-4">
                    <p className="text-[11px] font-bold text-graphite-500 uppercase tracking-wider mb-2">
                      Key Deliverables ({service.deliverables?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {service.deliverables?.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 bg-white border border-gray-200/60 rounded-md text-xs font-medium text-graphite-800 shadow-2xs"
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
                    className="font-semibold text-graphite-700 hover:text-graphite-950 flex items-center gap-1"
                  >
                    <span>View Public Page</span>
                    <Eye size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8 relative border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div>
                <h2 className="text-xl font-bold text-graphite-950">
                  {editingService ? 'Edit Service Offering' : 'Add New Service'}
                </h2>
                <p className="text-xs text-graphite-500">Configure offerings, deliverables, workflow steps, and FAQs</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex gap-2 border-b border-gray-100 pb-3 mb-6 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setModalTab('overview')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'overview' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                1. Overview
              </button>
              <button
                type="button"
                onClick={() => setModalTab('deliverables')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'deliverables' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                2. Deliverables & Tools
              </button>
              <button
                type="button"
                onClick={() => setModalTab('process')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'process' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                3. Workflow Steps ({formData.process.length})
              </button>
              <button
                type="button"
                onClick={() => setModalTab('faqs')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  modalTab === 'faqs' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                4. FAQs ({formData.faqs.length})
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TAB 1: Overview */}
              {modalTab === 'overview' && (
                <div className="space-y-4">
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
                        placeholder="e.g. UI/UX Design & Systems"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
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
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono text-center"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Icon Symbol
                      </label>
                      <select
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      >
                        {AVAILABLE_ICONS.map(ic => (
                          <option key={ic} value={ic}>{ic}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Short Description *
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="Brief overview of what this service delivers..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Full Detail Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.fullDescription}
                      onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                      placeholder="Comprehensive breakdown shown on the dedicated service detail page..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Deliverables & Tools */}
              {modalTab === 'deliverables' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Deliverables List (One per line) *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.deliverables}
                      onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                      placeholder="Wireframes&#10;High-Fidelity Mockups&#10;Design Tokens&#10;Interactive Prototype"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Tools & Technologies (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tools}
                      onChange={(e) => setFormData({ ...formData, tools: e.target.value })}
                      placeholder="Figma, Tailwind CSS, TypeScript, Adobe XD"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="text-xs font-bold text-graphite-900">Publish Service</p>
                      <p className="text-[11px] text-graphite-500">Enable this to display this service across the public website.</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                      className="w-5 h-5 text-graphite-950 rounded border-gray-300 focus:ring-graphite-950 cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: Workflow Process */}
              {modalTab === 'process' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-graphite-600">Define the sequential phases for this service:</p>
                    <button
                      type="button"
                      onClick={addProcessStep}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-graphite-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Step</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {formData.process.map((step, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 relative group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold bg-gray-200 text-graphite-800 px-2 py-0.5 rounded-md">
                            STEP {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProcessStep(idx)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                          placeholder="Step title (e.g. Discovery & Wireframing)"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-graphite-900 font-bold"
                        />
                        <textarea
                          rows={2}
                          value={step.description}
                          onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                          placeholder="Step explanation..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-graphite-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: FAQs */}
              {modalTab === 'faqs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-graphite-600">Frequently Asked Questions for this service:</p>
                    <button
                      type="button"
                      onClick={addFAQ}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-graphite-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add FAQ</span>
                    </button>
                  </div>

                  <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {formData.faqs.map((faq, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200/80 space-y-2 relative group">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold text-graphite-500 uppercase">
                            FAQ Item #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFAQ(idx)}
                            className="text-gray-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={faq.question}
                          onChange={(e) => updateFAQ(idx, 'question', e.target.value)}
                          placeholder="Question?"
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-graphite-900 font-bold"
                        />
                        <textarea
                          rows={2}
                          value={faq.answer}
                          onChange={(e) => updateFAQ(idx, 'answer', e.target.value)}
                          placeholder="Clear answer..."
                          className="w-full px-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-graphite-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div className="text-[11px] text-graphite-400">
                  {modalTab !== 'faqs' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (modalTab === 'overview') setModalTab('deliverables');
                        else if (modalTab === 'deliverables') setModalTab('process');
                        else if (modalTab === 'process') setModalTab('faqs');
                      }}
                      className="text-graphite-700 hover:text-graphite-950 font-semibold cursor-pointer"
                    >
                      Next section →
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-3">
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
                    {saving ? 'Saving...' : editingService ? 'Update Service' : 'Create Service'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Service?"
        message={`Are you sure you want to delete the "${serviceToDelete?.title}" service? This will remove it from the public portfolio.`}
        confirmLabel="Delete Service"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setServiceToDelete(null);
        }}
      />
    </AdminLayout>
  );
}
