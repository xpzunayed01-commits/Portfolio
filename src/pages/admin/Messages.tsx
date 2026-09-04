import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Trash2, 
  CheckCircle, 
  Search, 
  Reply, 
  Clock, 
  Circle, 
  Filter,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(msgs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    await updateDoc(doc(db, 'contactMessages', id), { status: newStatus });
  };

  const markAllAsRead = async () => {
    const unreadMsgs = messages.filter(m => m.status === 'unread');
    for (const m of unreadMsgs) {
      await updateDoc(doc(db, 'contactMessages', m.id), { status: 'read' });
    }
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        setDeletingId(id);
        await deleteDoc(doc(db, 'contactMessages', id));
      } finally {
        setDeletingId(null);
      }
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = 
      msg.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.projectType?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'unread') return matchesSearch && msg.status === 'unread';
    if (activeTab === 'read') return matchesSearch && msg.status === 'read';
    return matchesSearch;
  });

  return (
    <AdminLayout 
      title="Inquiries & Messages"
      actionButton={
        unreadCount > 0 ? (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-graphite-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs"
          >
            <CheckCheck size={16} />
            <span>Mark All Read</span>
          </button>
        ) : undefined
      }
    >
      {/* Search & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search inquiries by name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-graphite-900/10 focus:border-graphite-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all'
                ? 'bg-white text-graphite-900 shadow-xs'
                : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'unread'
                ? 'bg-white text-graphite-900 shadow-xs'
                : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-500 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'read'
                ? 'bg-white text-graphite-900 shadow-xs'
                : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            Read ({readCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-36 bg-white border border-gray-200 rounded-2xl w-full"></div>)}
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-200/80 shadow-xs">
          <Mail className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-base font-bold text-graphite-900">No messages found</h3>
          <p className="text-xs text-graphite-500 mt-1">
            {searchQuery ? 'Try adjusting your search criteria.' : 'When someone contacts you, inquiries appear here in real time.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredMessages.map((msg) => {
              const isUnread = msg.status === 'unread';
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={msg.id} 
                  className={`p-6 rounded-2xl border transition-all ${
                    isUnread 
                      ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10' 
                      : 'bg-white border-gray-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        {isUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse shrink-0"></span>
                        )}
                        <h3 className="text-base font-bold text-graphite-900">{msg.name}</h3>
                        <span className="text-xs font-semibold px-2.5 py-0.5 bg-gray-100 text-graphite-700 rounded-md">
                          {msg.projectType || 'General Inquiry'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-graphite-500">
                        <a href={`mailto:${msg.email}`} className="font-medium text-graphite-700 hover:text-blue-600 underline">
                          {msg.email}
                        </a>
                        {msg.budget && (
                          <span>· Budget: <strong className="text-graphite-800">{msg.budget}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for reaching out regarding ${encodeURIComponent(msg.projectType || 'your project')}!`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-graphite-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Reply by email"
                      >
                        <Reply size={14} />
                        <span>Reply</span>
                      </a>

                      <button 
                        onClick={() => toggleReadStatus(msg.id, msg.status)} 
                        className={`p-2 rounded-lg transition-colors ${
                          isUnread ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                      >
                        {isUnread ? <CheckCircle size={18} /> : <RotateCcw size={18} />}
                      </button>

                      <button 
                        onClick={() => deleteMessage(msg.id)} 
                        disabled={deletingId === msg.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50/80 p-4 rounded-xl border border-gray-100 text-sm text-graphite-800 leading-relaxed whitespace-pre-wrap">
                    {msg.message}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-graphite-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recent'}
                    </span>
                    <span className="font-mono uppercase text-[10px]">ID: {msg.id.slice(0, 8)}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </AdminLayout>
  );
}
