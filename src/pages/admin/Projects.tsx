import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Eye, 
  Star, 
  Copy, 
  Check, 
  X, 
  ArrowUpDown, 
  Filter, 
  Image as ImageIcon,
  Globe,
  Github,
  FileCode,
  CheckCircle2,
  CircleDashed,
  Layers,
  Sparkles
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import { fallbackProjects } from '@/data';
import { 
  saveProject, 
  removeProject, 
  duplicateProject 
} from '@/lib/portfolioService';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';
import { useToast } from '@/context/ToastContext';

const PRESET_CATEGORIES = [
  'UI/UX Design',
  'Web Design',
  'Website Development',
  'Brand Identity',
  'Landing Pages',
  'Mobile Apps',
  'Graphic Design'
];

export function AdminProjects() {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'featured'>('all');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formTab, setFormTab] = useState<'general' | 'media' | 'casestudy' | 'tech'>('general');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [saving, setSaving] = useState(false);

  // Deletion Confirm Dialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'UI/UX Design',
    categories: ['UI/UX Design'],
    shortDescription: '',
    year: new Date().getFullYear().toString(),
    technologies: 'React, Tailwind CSS, Figma',
    client: '',
    role: 'Lead UI/UX Designer',
    liveUrl: '',
    githubUrl: '',
    caseStudyUrl: '',
    coverImage: '',
    galleryUrls: '',
    overview: '',
    problem: '',
    goal: '',
    process: '',
    solution: '',
    learnings: '',
    featured: false,
    published: true,
    order: 1,
  });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(list);
      } else {
        setProjects(fallbackProjects);
      }
    }, () => {
      setProjects(fallbackProjects);
    });

    return () => unsub();
  }, []);

  const openCreateModal = () => {
    setEditingProject(null);
    setFormTab('general');
    setFormData({
      title: '',
      slug: '',
      category: 'UI/UX Design',
      categories: ['UI/UX Design'],
      shortDescription: '',
      year: new Date().getFullYear().toString(),
      technologies: 'React, Tailwind CSS, TypeScript, Figma',
      client: 'Client / Self-initiated',
      role: 'Lead Designer & Creative Developer',
      liveUrl: 'https://',
      githubUrl: '',
      caseStudyUrl: '',
      coverImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
      galleryUrls: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
      overview: 'Comprehensive digital experience designed with emphasis on ergonomics, visual hierarchy, and performance.',
      problem: 'Users required a faster, intuitive interface with clear navigation and reliable interactions.',
      goal: 'Deliver a modern, minimalist digital product that boosts user engagement.',
      process: 'Researched user workflows, crafted wireframes in Figma, iterated high-fidelity mockups, and built the production application in React.',
      solution: 'A cohesive web application with responsive layouts, accessible typography, and smooth micro-interactions.',
      learnings: 'Refining typography scales and simplifying navigation pathways yields significantly higher retention.',
      featured: false,
      published: true,
      order: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormTab('general');
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      categories: p.categories || [p.category],
      shortDescription: p.shortDescription || '',
      year: p.year || '2025',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      client: p.client || '',
      role: p.role || 'Designer & Developer',
      liveUrl: p.liveUrl || '',
      githubUrl: p.githubUrl || '',
      caseStudyUrl: p.caseStudyUrl || '',
      coverImage: p.coverImage || '',
      galleryUrls: Array.isArray(p.gallery) ? p.gallery.join('\n') : (p.coverImage || ''),
      overview: p.overview || '',
      problem: p.problem || '',
      goal: p.goal || '',
      process: p.process || '',
      solution: p.solution || '',
      learnings: p.learnings || '',
      featured: Boolean(p.featured),
      published: p.published !== undefined ? p.published : true,
      order: p.order || 1,
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
      slug: editingProject ? prev.slug : autoSlug
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toastError('Project title is required');
      return;
    }

    try {
      setSaving(true);
      const techArray = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const galleryArray = formData.galleryUrls
        .split('\n')
        .map(u => u.trim())
        .filter(Boolean);

      const projectPayload: Partial<Project> & { slug: string } = {
        title: formData.title.trim(),
        slug: formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: formData.category,
        categories: [formData.category],
        shortDescription: formData.shortDescription,
        year: formData.year,
        technologies: techArray,
        client: formData.client,
        role: formData.role,
        liveUrl: formData.liveUrl,
        githubUrl: formData.githubUrl,
        caseStudyUrl: formData.caseStudyUrl,
        coverImage: formData.coverImage,
        gallery: galleryArray.length > 0 ? galleryArray : [formData.coverImage],
        overview: formData.overview,
        problem: formData.problem,
        goal: formData.goal,
        process: formData.process,
        solution: formData.solution,
        learnings: formData.learnings,
        featured: formData.featured,
        published: formData.published,
        order: Number(formData.order) || 1,
      };

      if (editingProject?.id) {
        projectPayload.id = editingProject.id;
      }

      await saveProject(projectPayload);
      setIsModalOpen(false);
      toastSuccess(editingProject ? 'Project updated successfully' : 'New project created');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error saving project');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicate = async (p: Project) => {
    try {
      toastInfo(`Duplicating "${p.title}"...`);
      await duplicateProject(p);
      toastSuccess('Project duplicated as draft');
    } catch (err: any) {
      console.error(err);
      toastError(err.message || 'Error duplicating project');
    }
  };

  const togglePublished = async (p: Project) => {
    try {
      const nextPublished = p.published === false ? true : false;
      await saveProject({
        ...p,
        published: nextPublished
      });
      toastSuccess(`Project ${nextPublished ? 'published' : 'moved to draft'}`);
    } catch (err: any) {
      console.error(err);
      toastError('Failed to update status');
    }
  };

  const toggleFeatured = async (p: Project) => {
    try {
      await saveProject({
        ...p,
        featured: !p.featured
      });
      toastSuccess(`Project ${!p.featured ? 'featured on homepage' : 'unfeatured'}`);
    } catch (err: any) {
      console.error(err);
      toastError('Failed to toggle featured status');
    }
  };

  const triggerDelete = (p: Project) => {
    setProjectToDelete(p);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!projectToDelete) return;
    try {
      setDeleting(true);
      await removeProject(projectToDelete.id || projectToDelete.slug);
      setConfirmOpen(false);
      setProjectToDelete(null);
      toastSuccess('Project deleted successfully');
    } catch (err: any) {
      console.error(err);
      toastError('Error deleting project');
    } finally {
      setDeleting(false);
    }
  };

  // Filter & Sort Pipeline
  const filteredProjects = projects
    .filter(p => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        p.title.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.slug.toLowerCase().includes(query) ||
        (p.client && p.client.toLowerCase().includes(query)) ||
        (p.shortDescription && p.shortDescription.toLowerCase().includes(query));

      const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;

      let matchesStatus = true;
      if (statusFilter === 'published') matchesStatus = p.published !== false;
      if (statusFilter === 'draft') matchesStatus = p.published === false;
      if (statusFilter === 'featured') matchesStatus = Boolean(p.featured);

      return matchesSearch && matchesCat && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'oldest') return (Number(a.year) || 0) - (Number(b.year) || 0);
      return (Number(b.year) || 0) - (Number(a.year) || 0);
    });

  return (
    <AdminLayout
      title="Projects & Case Studies"
      subtitle="Create, edit, duplicate, and publish your portfolio project showcases."
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      }
    >
      {/* Controls Bar: Search, Status Tabs, Category Filter, Sort */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, client, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 transition-all"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl w-full md:w-auto">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
              }`}
            >
              All ({projects.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'published' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
              }`}
            >
              Published ({projects.filter(p => p.published !== false).length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'draft' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
              }`}
            >
              Drafts ({projects.filter(p => p.published === false).length})
            </button>
            <button
              onClick={() => setStatusFilter('featured')}
              className={`flex-1 md:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                statusFilter === 'featured' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
              }`}
            >
              Featured ({projects.filter(p => p.featured).length})
            </button>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <ArrowUpDown size={14} className="text-gray-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-medium text-graphite-700 w-full md:w-auto"
            >
              <option value="newest">Year: Newest First</option>
              <option value="oldest">Year: Oldest First</option>
              <option value="title">Title: Alphabetical A-Z</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-gray-100 scrollbar-none">
          <button
            onClick={() => setCategoryFilter('All')}
            className={`px-3 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors ${
              categoryFilter === 'All' ? 'bg-graphite-900 text-white' : 'bg-gray-100 text-graphite-600 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {PRESET_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 text-[11px] font-bold rounded-lg shrink-0 transition-colors ${
                categoryFilter === cat ? 'bg-graphite-900 text-white' : 'bg-gray-100 text-graphite-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No projects match your filter"
          description="Try clearing your search query, switching categories, or create a new project."
          actionLabel="Create Project"
          onAction={openCreateModal}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-graphite-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Project Overview</th>
                  <th className="py-3.5 px-6">Category & Year</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6">Featured</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredProjects.map((p) => {
                  const isPub = p.published !== false;
                  return (
                    <tr key={p.id || p.slug} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={p.coverImage}
                            alt={p.title}
                            className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100 shadow-2xs"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-graphite-900 text-sm truncate max-w-xs">{p.title}</p>
                            </div>
                            <p className="text-[11px] text-graphite-400 font-mono">/work/{p.slug}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-gray-100 text-graphite-700 font-semibold rounded-md inline-block mb-1">
                          {p.category}
                        </span>
                        <p className="text-[11px] text-graphite-400">{p.year} · {p.client || 'Self'}</p>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => togglePublished(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                            isPub 
                              ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                          }`}
                          title="Click to toggle Published / Draft status"
                        >
                          {isPub ? <CheckCircle2 size={12} className="text-emerald-600" /> : <CircleDashed size={12} />}
                          <span>{isPub ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-all cursor-pointer ${
                            p.featured
                              ? 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200/60'
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                          title="Click to toggle Homepage feature status"
                        >
                          <Star size={12} className={p.featured ? 'fill-amber-500 text-amber-500' : ''} />
                          <span>{p.featured ? 'Featured' : 'Standard'}</span>
                        </button>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`/work/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-graphite-500 hover:text-graphite-950 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View public page"
                          >
                            <Eye size={15} />
                          </a>
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 text-graphite-500 hover:text-graphite-950 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                            title="Duplicate as draft"
                          >
                            <Copy size={15} />
                          </button>
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => triggerDelete(p)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comprehensive Tabbed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl my-8 relative border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <h2 className="text-xl font-bold text-graphite-950">
                  {editingProject ? 'Edit Project Showcase' : 'Create New Project'}
                </h2>
                <p className="text-xs text-graphite-500">Provide all project details and case study narrative</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex gap-2 border-b border-gray-100 pb-3 mb-6 overflow-x-auto scrollbar-none">
              <button
                type="button"
                onClick={() => setFormTab('general')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formTab === 'general' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                1. General Info
              </button>
              <button
                type="button"
                onClick={() => setFormTab('media')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formTab === 'media' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                2. Media & Links
              </button>
              <button
                type="button"
                onClick={() => setFormTab('casestudy')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formTab === 'casestudy' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                3. Case Study Story
              </button>
              <button
                type="button"
                onClick={() => setFormTab('tech')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  formTab === 'tech' ? 'bg-graphite-950 text-white' : 'text-graphite-600 hover:bg-gray-100'
                }`}
              >
                4. Tech & Status
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TAB 1: General */}
              {formTab === 'general' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        placeholder="e.g. Minimalist Fintech Dashboard"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="e.g. minimalist-fintech-dashboard"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Primary Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      >
                        {PRESET_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Year
                      </label>
                      <input
                        type="text"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Client / Context
                      </label>
                      <input
                        type="text"
                        value={formData.client}
                        onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        placeholder="e.g. Stripe Partner / Self"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Your Role
                    </label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Lead UI/UX Designer & Creative Developer"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      One-Line Short Summary
                    </label>
                    <input
                      type="text"
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      placeholder="High-level overview shown in cards and teasers"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: Media & Links */}
              {formTab === 'media' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Cover Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.coverImage}
                      onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                    />
                    {formData.coverImage && (
                      <div className="mt-2 w-full h-32 rounded-xl bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={formData.coverImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Gallery Images (One URL per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.galleryUrls}
                      onChange={(e) => setFormData({ ...formData, galleryUrls: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-1&#10;https://images.unsplash.com/photo-2"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Live Website / Prototype URL
                      </label>
                      <input
                        type="url"
                        value={formData.liveUrl}
                        onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        GitHub Repository URL
                      </label>
                      <input
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        placeholder="https://github.com/username/repo"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Case Study */}
              {formTab === 'casestudy' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Project Overview
                    </label>
                    <textarea
                      rows={2}
                      value={formData.overview}
                      onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                      placeholder="Broad background and concept description..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        The Challenge / Problem
                      </label>
                      <textarea
                        rows={3}
                        value={formData.problem}
                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                        placeholder="What obstacle or friction were users facing?"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        The Project Goal
                      </label>
                      <textarea
                        rows={3}
                        value={formData.goal}
                        onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                        placeholder="What were the explicit target outcomes?"
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Process & Methodology
                      </label>
                      <textarea
                        rows={3}
                        value={formData.process}
                        onChange={(e) => setFormData({ ...formData, process: e.target.value })}
                        placeholder="Wireframing, UI prototyping, tech architecture..."
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                        Solution & Execution
                      </label>
                      <textarea
                        rows={3}
                        value={formData.solution}
                        onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                        placeholder="How the final interface solved the challenge..."
                        className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Learnings & Takeaways
                    </label>
                    <textarea
                      rows={2}
                      value={formData.learnings}
                      onChange={(e) => setFormData({ ...formData, learnings: e.target.value })}
                      placeholder="Key engineering or UX lessons learned..."
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                  </div>
                </div>
              )}

              {/* TAB 4: Tech & Status */}
              {formTab === 'tech' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                      Technologies Used (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, TypeScript, Tailwind CSS, Vite, Figma"
                      className="w-full px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formData.technologies.split(',').map(t => t.trim()).filter(Boolean).map(t => (
                        <span key={t} className="px-2.5 py-0.5 bg-gray-100 border border-gray-200 rounded-md text-[11px] font-medium text-graphite-700">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
                    <h3 className="text-xs font-bold text-graphite-900 uppercase">Visibility & Display Settings</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-graphite-900">Publish to Public Portfolio</p>
                        <p className="text-[11px] text-graphite-500">When enabled, visitors can see and explore this project.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        className="w-5 h-5 text-graphite-950 rounded border-gray-300 focus:ring-graphite-950 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-200/60 pt-3">
                      <div>
                        <p className="text-xs font-bold text-graphite-900">Feature on Homepage</p>
                        <p className="text-[11px] text-graphite-500">Highlights this item in the curated works grid.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="w-5 h-5 text-graphite-950 rounded border-gray-300 focus:ring-graphite-950 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                <div className="text-[11px] text-graphite-400">
                  {formTab !== 'tech' && (
                    <button
                      type="button"
                      onClick={() => {
                        if (formTab === 'general') setFormTab('media');
                        else if (formTab === 'media') setFormTab('casestudy');
                        else if (formTab === 'casestudy') setFormTab('tech');
                      }}
                      className="text-graphite-700 hover:text-graphite-950 font-semibold cursor-pointer"
                    >
                      Next step →
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
                    {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Publish Project'}
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
        title="Delete Project?"
        message={`Are you sure you want to permanently delete "${projectToDelete?.title}"? This action cannot be undone.`}
        confirmLabel="Delete Project"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setProjectToDelete(null);
        }}
      />
    </AdminLayout>
  );
}
