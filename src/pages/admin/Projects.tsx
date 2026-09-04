import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  X, 
  Sparkles, 
  Eye, 
  Layers,
  Star,
  Image as ImageIcon
} from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project } from '@/types';
import { fallbackProjects } from '@/data';
import { saveProject, removeProject } from '@/lib/portfolioService';

export function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'UI/UX Design',
    shortDescription: '',
    year: new Date().getFullYear().toString(),
    technologies: 'React, Tailwind CSS, Figma',
    client: 'Client Name',
    liveUrl: 'https://',
    coverImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
    overview: '',
    problem: '',
    process: '',
    featured: true,
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
    setFormData({
      title: '',
      slug: '',
      category: 'UI/UX Design',
      shortDescription: '',
      year: new Date().getFullYear().toString(),
      technologies: 'React, Tailwind CSS, Figma',
      client: 'Client / Self',
      liveUrl: 'https://',
      coverImage: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&q=80&w=2070',
      overview: '',
      problem: '',
      process: '',
      featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Project) => {
    setEditingProject(p);
    setFormData({
      title: p.title,
      slug: p.slug,
      category: p.category,
      shortDescription: p.shortDescription || '',
      year: p.year || '2025',
      technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : '',
      client: p.client || '',
      liveUrl: p.liveUrl || '',
      coverImage: p.coverImage || '',
      overview: p.overview || '',
      problem: p.problem || '',
      process: p.process || '',
      featured: Boolean(p.featured),
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
    try {
      setSaving(true);
      const techArray = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      const projectPayload: Partial<Project> & { slug: string } = {
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        category: formData.category,
        shortDescription: formData.shortDescription,
        year: formData.year,
        technologies: techArray,
        client: formData.client,
        liveUrl: formData.liveUrl,
        coverImage: formData.coverImage,
        gallery: editingProject?.gallery || [formData.coverImage],
        overview: formData.overview,
        problem: formData.problem,
        process: formData.process,
        featured: formData.featured,
      };

      if (editingProject?.id) {
        projectPayload.id = editingProject.id;
      }

      await saveProject(projectPayload);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert('Error saving project: ' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      setDeletingId(id);
      await removeProject(id);
    } catch (err) {
      console.error(err);
      alert('Error deleting project: ' + (err as Error).message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleFeatured = async (p: Project) => {
    try {
      await saveProject({
        ...p,
        featured: !p.featured,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'UI/UX Design', 'Web Design', 'Website Development', 'Brand Identity'];

  const filteredProjects = projects.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout
      title="Projects & Case Studies"
      actionButton={
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
        >
          <Plus size={16} />
          <span>Add New Project</span>
        </button>
      }
    >
      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-graphite-900/10 focus:border-graphite-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-graphite-900 text-white'
                  : 'bg-gray-100 text-graphite-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Table / Grid */}
      <div className="bg-white rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold text-graphite-500 uppercase tracking-wider">
                <th className="py-3.5 px-6">Project</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Year / Client</th>
                <th className="py-3.5 px-6">Featured</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-graphite-400">
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => (
                  <tr key={p.id || p.slug} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 shrink-0 border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-graphite-900">{p.title}</p>
                          <p className="text-xs text-graphite-500 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 bg-gray-100 text-graphite-700 text-xs font-semibold rounded-md">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-xs font-semibold text-graphite-800">{p.client || 'Self'}</p>
                      <p className="text-[11px] text-graphite-400">{p.year}</p>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => toggleFeatured(p)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                          p.featured
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <Star size={12} className={p.featured ? 'fill-amber-500 text-amber-500' : ''} />
                        <span>{p.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/work/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-graphite-500 hover:text-graphite-900 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Preview live"
                        >
                          <Eye size={16} />
                        </a>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id || p.slug)}
                          disabled={deletingId === (p.id || p.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8 relative">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
              <h2 className="text-xl font-bold text-graphite-900">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="e.g. FocusFlow App"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
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
                    placeholder="e.g. focusflow-app"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  >
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Web Design">Web Design</option>
                    <option value="Website Development">Website Development</option>
                    <option value="Brand Identity">Brand Identity</option>
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
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Client
                  </label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g. Startup Co."
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="A one-line summary of the project"
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.technologies}
                    onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                    placeholder="React, Figma, Tailwind CSS"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Cover Image URL
                </label>
                <input
                  type="url"
                  value={formData.coverImage}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-700 uppercase mb-1">
                  Overview / Full Story
                </label>
                <textarea
                  rows={3}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Describe the context, requirements, and design execution..."
                  className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredCheckbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-graphite-900 rounded border-gray-300 focus:ring-graphite-900"
                />
                <label htmlFor="featuredCheckbox" className="text-xs font-bold text-graphite-800 cursor-pointer">
                  Feature this project on the Homepage
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-graphite-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-bold text-white bg-graphite-900 hover:bg-graphite-800 rounded-xl transition-colors shadow-xs flex items-center gap-2"
                >
                  {saving ? 'Saving...' : editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
