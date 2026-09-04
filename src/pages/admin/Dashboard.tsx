import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Briefcase, 
  Layers, 
  FileText, 
  Mail, 
  Plus, 
  ArrowUpRight, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  FolderKanban
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Project, Service, Certificate } from '@/types';
import { fallbackProjects, fallbackServices, fallbackCertificates } from '@/data';
import { seedFirestoreWithDefaults } from '@/lib/portfolioService';

export function AdminDashboard() {
  const [projectCount, setProjectCount] = useState<number>(fallbackProjects.length);
  const [serviceCount, setServiceCount] = useState<number>(fallbackServices.length);
  const [certCount, setCertCount] = useState<number>(fallbackCertificates.length);
  const [unreadMsgCount, setUnreadMsgCount] = useState<number>(0);
  const [recentMessages, setRecentMessages] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<Project[]>(fallbackProjects.slice(0, 4));
  const [seeding, setSeeding] = useState(false);
  const [seedSuccess, setSeedSuccess] = useState(false);

  useEffect(() => {
    // Projects listener
    const projUnsub = onSnapshot(collection(db, 'projects'), (snap) => {
      if (!snap.empty) {
        setProjectCount(snap.size);
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setRecentProjects(list.slice(0, 4));
      }
    }, () => {});

    // Services listener
    const srvUnsub = onSnapshot(collection(db, 'services'), (snap) => {
      if (!snap.empty) setServiceCount(snap.size);
    }, () => {});

    // Certificates listener
    const certUnsub = onSnapshot(collection(db, 'certificates'), (snap) => {
      if (!snap.empty) setCertCount(snap.size);
    }, () => {});

    // Unread messages
    const unreadUnsub = onSnapshot(
      query(collection(db, 'contactMessages'), where('status', '==', 'unread')),
      (snap) => {
        setUnreadMsgCount(snap.size);
      },
      () => {}
    );

    // Recent 5 messages
    const msgsUnsub = onSnapshot(
      query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'), limit(5)),
      (snap) => {
        const msgs = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentMessages(msgs);
      },
      () => {}
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
      setSeedSuccess(true);
      setTimeout(() => setSeedSuccess(false), 4000);
    } catch (e) {
      console.error(e);
      alert('Error initializing database: ' + (e as Error).message);
    } finally {
      setSeeding(false);
    }
  };

  const statCards = [
    {
      title: 'Projects',
      count: projectCount,
      desc: 'Active portfolio items',
      icon: <Briefcase className="text-blue-600" size={22} />,
      bgColor: 'bg-blue-50',
      link: '/Root/projects'
    },
    {
      title: 'Services',
      count: serviceCount,
      desc: 'Client offerings',
      icon: <Layers className="text-purple-600" size={22} />,
      bgColor: 'bg-purple-50',
      link: '/Root/services'
    },
    {
      title: 'Certificates',
      count: certCount,
      desc: 'Verified credentials',
      icon: <FileText className="text-emerald-600" size={22} />,
      bgColor: 'bg-emerald-50',
      link: '/Root/certificates'
    },
    {
      title: 'New Inquiries',
      count: unreadMsgCount,
      desc: 'Unread client messages',
      icon: <Mail className="text-amber-600" size={22} />,
      bgColor: 'bg-amber-50',
      link: '/Root/messages'
    },
  ];

  return (
    <AdminLayout
      title="System Overview"
      actionButton={
        <div className="flex items-center gap-3">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-graphite-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs"
            title="Sync/Seed initial fallback data to Firestore"
          >
            <RefreshCw size={14} className={seeding ? 'animate-spin' : ''} />
            <span>{seeding ? 'Syncing...' : seedSuccess ? 'Synced!' : 'Seed Defaults'}</span>
          </button>
          <Link
            to="/Root/projects"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-graphite-900 rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
          >
            <Plus size={16} />
            <span>New Project</span>
          </Link>
        </div>
      }
    >
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor}`}>
                {stat.icon}
              </div>
              <ArrowUpRight size={18} className="text-gray-400 group-hover:text-graphite-900 transition-colors" />
            </div>
            <div className="text-3xl font-extrabold text-graphite-900 tracking-tight mb-1">
              {stat.count}
            </div>
            <div className="text-sm font-semibold text-graphite-700">
              {stat.title}
            </div>
            <div className="text-xs text-graphite-500 mt-0.5">
              {stat.desc}
            </div>
          </Link>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Messages Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
          <div className="flex items-center justify-between pb-5 border-b border-gray-100">
            <div>
              <h2 className="text-base font-bold text-graphite-900">Recent Inquiries</h2>
              <p className="text-xs text-graphite-500">Latest messages submitted via the contact form</p>
            </div>
            <Link
              to="/Root/messages"
              className="text-xs font-semibold text-graphite-900 hover:underline flex items-center gap-1"
            >
              View All ({recentMessages.length})
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentMessages.length === 0 ? (
              <div className="py-12 text-center text-graphite-400">
                <Mail size={36} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No contact inquiries yet.</p>
                <p className="text-xs text-gray-400 mt-1">Inquiries sent from the contact page will appear here.</p>
              </div>
            ) : (
              recentMessages.map((msg) => (
                <div key={msg.id} className="py-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-graphite-900 truncate">
                        {msg.name}
                      </span>
                      {msg.status === 'unread' && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
                          NEW
                        </span>
                      )}
                      <span className="text-xs text-graphite-400">· {msg.projectType || 'General'}</span>
                    </div>
                    <p className="text-xs text-graphite-600 line-clamp-2 leading-relaxed">
                      {msg.message}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-graphite-400">
                      <span>{msg.email}</span>
                      {msg.budget && <span>Budget: {msg.budget}</span>}
                    </div>
                  </div>
                  <Link
                    to="/Root/messages"
                    className="p-2 text-graphite-400 hover:text-graphite-900 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Live Projects */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <h2 className="text-base font-bold text-graphite-900 mb-4">Quick Management</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/Root/projects"
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors flex flex-col gap-2"
              >
                <Briefcase size={18} className="text-graphite-700" />
                <span className="text-xs font-semibold text-graphite-900">Add Project</span>
              </Link>
              <Link
                to="/Root/services"
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors flex flex-col gap-2"
              >
                <Layers size={18} className="text-graphite-700" />
                <span className="text-xs font-semibold text-graphite-900">Manage Services</span>
              </Link>
              <Link
                to="/Root/certificates"
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors flex flex-col gap-2"
              >
                <FileText size={18} className="text-graphite-700" />
                <span className="text-xs font-semibold text-graphite-900">Add Certificate</span>
              </Link>
              <Link
                to="/Root/profile"
                className="p-3 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors flex flex-col gap-2"
              >
                <Sparkles size={18} className="text-graphite-700" />
                <span className="text-xs font-semibold text-graphite-900">Edit Bio & Links</span>
              </Link>
            </div>
          </div>

          {/* Quick Projects List */}
          <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-graphite-900">Recent Projects</h2>
              <Link to="/Root/projects" className="text-xs font-semibold text-graphite-900 hover:underline">
                Manage
              </Link>
            </div>
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-graphite-900 truncate">{p.title}</p>
                      <p className="text-[11px] text-graphite-500">{p.category} · {p.year}</p>
                    </div>
                  </div>
                  {p.featured && (
                    <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-full shrink-0">
                      Featured
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
