import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  FolderKanban, 
  Briefcase, 
  Award, 
  Mail, 
  Plus, 
  ArrowUpRight, 
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Edit3,
  UserRound
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Service, Certificate, ContactMessage } from '@/types';
import { fallbackProjects, fallbackServices, fallbackCertificates } from '@/data';
import { seedFirestoreWithDefaults } from '@/lib/portfolioService';
import { useToast } from '@/context/ToastContext';

export function AdminDashboard() {
  const { toastSuccess, toastError } = useToast();
  const [loading, setLoading] = useState(true);

  // Statistics
  const [totalProjects, setTotalProjects] = useState<number>(0);
  const [publishedProjects, setPublishedProjects] = useState<number>(0);
  const [draftProjects, setDraftProjects] = useState<number>(0);
  const [totalServices, setTotalServices] = useState<number>(0);
  const [totalCertificates, setTotalCertificates] = useState<number>(0);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);

  // Recent Collections
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessage[]>([]);
  const [recentCertificates, setRecentCertificates] = useState<Certificate[]>([]);

  // Seeding
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    // 1. Projects listener
    const projUnsub = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setTotalProjects(list.length);
        setPublishedProjects(list.filter(p => p.published !== false).length);
        setDraftProjects(list.filter(p => p.published === false).length);
        setRecentProjects(list.slice(0, 4));
      } else {
        setTotalProjects(fallbackProjects.length);
        setPublishedProjects(fallbackProjects.filter(p => p.published !== false).length);
        setDraftProjects(0);
        setRecentProjects(fallbackProjects.slice(0, 4));
      }
      setLoading(false);
    }, (err) => {
      console.error(err);
      setTotalProjects(fallbackProjects.length);
      setPublishedProjects(fallbackProjects.length);
      setDraftProjects(0);
      setRecentProjects(fallbackProjects.slice(0, 4));
      setLoading(false);
    });

    // 2. Services listener
    const srvUnsub = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) {
        setTotalServices(snap.size);
      } else {
        setTotalServices(fallbackServices.length);
      }
    }, () => {
      setTotalServices(fallbackServices.length);
    });

    // 3. Certificates listener
    const certUnsub = onSnapshot(collection(db, 'certificates'), (snap) => {
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
        setTotalCertificates(list.length);
        setRecentCertificates(list.slice(0, 3));
      } else {
        setTotalCertificates(fallbackCertificates.length);
        setRecentCertificates(fallbackCertificates.slice(0, 3));
      }
    }, () => {
      setTotalCertificates(fallbackCertificates.length);
      setRecentCertificates(fallbackCertificates.slice(0, 3));
    });

    // 4. Unread messages count
    const unreadUnsub = onSnapshot(
      query(collection(db, 'contactMessages'), where('status', '==', 'unread')),
      (snap) => {
        setUnreadMsgCount(snap.size);
      },
      () => setUnreadMsgCount(0)
    );

    // 5. Recent 5 messages
    const msgsUnsub = onSnapshot(
      query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(5)),
      (snap) => {
        const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
        setRecentMessages(msgs);
      },
      () => setRecentMessages([])
    );

    return () => {
      projUnsub();
      srvUnsub();
      certUnsub();
      unreadUnsub();
      msgsUnsub();
    };
  }, []);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      await seedFirestoreWithDefaults();
      toastSuccess('Default data synchronized to Firestore!');
    } catch (e: any) {
      console.error(e);
      toastError('Error initializing database: ' + (e.message || 'Unknown error'));
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      count: totalProjects,
      subtext: `${publishedProjects} Published · ${draftProjects} Drafts`,
      icon: <FolderKanban className="text-blue-600" size={20} />,
      bgColor: 'bg-blue-50',
      link: '/Root/projects'
    },
    {
      title: 'Total Services',
      count: totalServices,
      subtext: 'Active client solutions',
      icon: <Briefcase className="text-purple-600" size={20} />,
      bgColor: 'bg-purple-50',
      link: '/Root/services'
    },
    {
      title: 'Total Certificates',
      count: totalCertificates,
      subtext: 'Verified credentials',
      icon: <Award className="text-emerald-600" size={20} />,
      bgColor: 'bg-emerald-50',
      link: '/Root/certificates'
    },
    {
      title: 'Unread Messages',
      count: unreadMsgCount,
      subtext: 'Contact inquiries',
      icon: <Mail className="text-amber-600" size={20} />,
      bgColor: 'bg-amber-50',
      link: '/Root/messages'
    },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Manage your portfolio content and keep everything up to date."
      actionButton={
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-graphite-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs cursor-pointer disabled:opacity-50"
            title="Sync/Seed initial fallback data to Firestore"
          >
            <RefreshCw size={13} className={seeding ? 'animate-spin' : ''} />
            <span>{seeding ? 'Syncing...' : 'Seed Defaults'}</span>
          </button>
          <Link
            to="/Root/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-graphite-950 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
          >
            <Plus size={15} />
            <span>Add Project</span>
          </Link>
        </div>
      }
    >
      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white p-5 md:p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={16} className="text-gray-400 group-hover:text-graphite-900 transition-colors" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-graphite-950 tracking-tight mb-1">
              {loading ? (
                <div className="h-8 w-12 bg-gray-100 rounded-md animate-pulse"></div>
              ) : (
                stat.count
              )}
            </div>
            <div className="text-xs md:text-sm font-bold text-graphite-800">
              {stat.title}
            </div>
            <div className="text-[11px] text-graphite-500 mt-0.5">
              {stat.subtext}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 mb-8 shadow-xs">
        <h2 className="text-xs font-bold text-graphite-400 uppercase tracking-widest mb-3.5">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link
            to="/Root/projects"
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all flex flex-col gap-2 group border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-xs font-bold text-graphite-900 group-hover:text-blue-600 transition-colors">
              + Add Project
            </span>
          </Link>

          <Link
            to="/Root/services"
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all flex flex-col gap-2 group border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-xs font-bold text-graphite-900 group-hover:text-purple-600 transition-colors">
              + Add Service
            </span>
          </Link>

          <Link
            to="/Root/certificates"
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all flex flex-col gap-2 group border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-xs font-bold text-graphite-900 group-hover:text-emerald-600 transition-colors">
              + Add Certificate
            </span>
          </Link>

          <Link
            to="/Root/messages"
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all flex flex-col gap-2 group border border-transparent hover:border-gray-200"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Mail size={16} />
            </div>
            <span className="text-xs font-bold text-graphite-900 group-hover:text-amber-600 transition-colors">
              View Messages
            </span>
          </Link>

          <Link
            to="/Root/profile"
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-all flex flex-col gap-2 group border border-transparent hover:border-gray-200 col-span-2 sm:col-span-1"
          >
            <div className="w-7 h-7 rounded-lg bg-gray-200 text-graphite-800 flex items-center justify-center">
              <UserRound size={16} />
            </div>
            <span className="text-xs font-bold text-graphite-900 group-hover:text-graphite-600 transition-colors">
              Edit Profile & Bio
            </span>
          </Link>
        </div>
      </div>

      {/* Main Grid: Recent Inquiries + Recent Projects & Certificates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Messages Section (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-graphite-950">Recent Messages</h2>
              <p className="text-xs text-graphite-500">Client inquiries submitted via the public contact form</p>
            </div>
            <Link
              to="/Root/messages"
              className="text-xs font-bold text-graphite-900 hover:underline flex items-center gap-1"
            >
              View All
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentMessages.length === 0 ? (
              <div className="py-12 text-center text-graphite-400">
                <Mail size={32} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-bold text-graphite-700">No messages yet.</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Inquiries submitted from the contact page will appear here.</p>
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-graphite-950 truncate">
                        {msg.name}
                      </span>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[9px] font-black rounded-full uppercase tracking-wider">
                          UNREAD
                        </span>
                      )}
                      <span className="text-[11px] text-graphite-400">· {msg.projectType || 'General Inquiry'}</span>
                    </div>
                    <p className="text-xs text-graphite-600 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] text-graphite-400">
                      <span>{msg.email}</span>
                      {msg.budget && <span>· Budget: {msg.budget}</span>}
                    </div>
                  </div>
                  <Link
                    to="/Root/messages"
                    className="p-2 text-graphite-400 hover:text-graphite-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                    title="View Message"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recent Projects & Recent Certificates */}
        <div className="space-y-6">
          {/* Recent Projects Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-graphite-950">Recent Projects</h2>
              <Link to="/Root/projects" className="text-xs font-bold text-graphite-900 hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.length === 0 ? (
                <div className="py-6 text-center text-graphite-400">
                  <p className="text-xs font-medium">No projects yet.</p>
                </div>
              ) : (
                recentProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-graphite-900 truncate">{p.title}</p>
                        <p className="text-[10px] text-graphite-500">{p.category} · {p.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {p.published === false && (
                        <span className="px-2 py-0.5 bg-gray-100 text-graphite-600 text-[9px] font-bold rounded-md">
                          Draft
                        </span>
                      )}
                      {p.featured && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[9px] font-bold rounded-md border border-amber-200/60">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Certificates Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-graphite-950">Certificates</h2>
              <Link to="/Root/certificates" className="text-xs font-bold text-graphite-900 hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {recentCertificates.length === 0 ? (
                <div className="py-6 text-center text-graphite-400">
                  <p className="text-xs font-medium">No certificates yet.</p>
                </div>
              ) : (
                recentCertificates.map((cert) => (
                  <div key={cert.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0 border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-graphite-900 truncate">{cert.title}</p>
                        <p className="text-[10px] text-graphite-500">{cert.issuer}</p>
                      </div>
                    </div>
                    <Link
                      to="/Root/certificates"
                      className="p-1.5 text-gray-400 hover:text-graphite-900 hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit3 size={14} />
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
