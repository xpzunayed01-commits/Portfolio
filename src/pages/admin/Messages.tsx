import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Reply, 
  Clock, 
  CircleDashed,
  Archive,
  ArchiveRestore,
  RotateCcw,
  CheckCheck,
  ExternalLink,
  X,
  DollarSign,
  User,
  Inbox
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ContactMessage } from '@/types';
import { 
  updateMessageStatus, 
  removeMessage, 
  markAllMessagesAsRead 
} from '@/lib/portfolioService';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { EmptyState } from '@/components/admin/EmptyState';
import { useToast } from '@/context/ToastContext';

export function AdminMessages() {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'read' | 'archived'>('all');
  
  // Selected Message Modal
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Deletion
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [msgToDelete, setMsgToDelete] = useState<ContactMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
      setMessages(msgs);
      setLoading(false);
    }, () => {
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: 'unread' | 'read' | 'archived') => {
    try {
      await updateMessageStatus(id, newStatus);
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      toastSuccess(`Message marked as ${newStatus}`);
    } catch (err: any) {
      console.error(err);
      toastError('Failed to update message status');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllMessagesAsRead(messages);
      toastSuccess('All unread messages marked as read');
    } catch (err: any) {
      console.error(err);
      toastError('Error marking messages as read');
    }
  };

  const triggerDelete = (msg: ContactMessage) => {
    setMsgToDelete(msg);
    setConfirmOpen(true);
  };

  const executeDelete = async () => {
    if (!msgToDelete) return;
    try {
      setDeleting(true);
      await removeMessage(msgToDelete.id);
      if (selectedMessage && selectedMessage.id === msgToDelete.id) {
        setSelectedMessage(null);
      }
      setConfirmOpen(false);
      setMsgToDelete(null);
      toastSuccess('Message deleted');
    } catch (err: any) {
      console.error(err);
      toastError('Error deleting message');
    } finally {
      setDeleting(false);
    }
  };

  const openMessageDetail = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'unread') {
      await updateMessageStatus(msg.id, 'read');
    }
  };

  const unreadCount = messages.filter(m => m.status === 'unread').length;
  const readCount = messages.filter(m => m.status === 'read').length;
  const archivedCount = messages.filter(m => m.status === 'archived').length;

  const filteredMessages = messages.filter(msg => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (msg.name && msg.name.toLowerCase().includes(q)) ||
      (msg.email && msg.email.toLowerCase().includes(q)) ||
      (msg.message && msg.message.toLowerCase().includes(q)) ||
      (msg.projectType && msg.projectType.toLowerCase().includes(q)) ||
      (msg.budget && msg.budget.toLowerCase().includes(q));
    
    if (activeTab === 'unread') return matchesSearch && msg.status === 'unread';
    if (activeTab === 'read') return matchesSearch && msg.status === 'read';
    if (activeTab === 'archived') return matchesSearch && msg.status === 'archived';
    return matchesSearch && msg.status !== 'archived';
  });

  return (
    <AdminLayout 
      title="Inquiries & Messages"
      subtitle="Review incoming project requests, client inquiries, and budget estimates."
      actionButton={
        unreadCount > 0 ? (
          <button
            onClick={handleMarkAllRead}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-graphite-800 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-2xs cursor-pointer"
          >
            <CheckCheck size={16} />
            <span>Mark All As Read</span>
          </button>
        ) : undefined
      }
    >
      {/* Search & Filter Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-4 mb-6 shadow-xs flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by client name, email, or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:border-graphite-900 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'all' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            Active ({messages.filter(m => m.status !== 'archived').length})
          </button>
          <button
            onClick={() => setActiveTab('unread')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'unread' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 bg-blue-600 text-white text-[10px] font-bold rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('read')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'read' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            Read ({readCount})
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'archived' ? 'bg-white text-graphite-900 shadow-xs' : 'text-graphite-600 hover:text-graphite-900'
            }`}
          >
            Archived ({archivedCount})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-gray-200 rounded-2xl w-full"></div>)}
        </div>
      ) : filteredMessages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={searchQuery ? 'No matching inquiries' : activeTab === 'unread' ? 'Zero unread messages' : 'Inbox is clear'}
          description={
            searchQuery
              ? 'Try modifying your search query or clear the filter.'
              : 'When potential clients reach out via the contact form, submissions appear here in real time.'
          }
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {filteredMessages.map((msg) => {
              const isUnread = msg.status === 'unread';
              const isArchived = msg.status === 'archived';

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  key={msg.id} 
                  className={`p-6 rounded-2xl border transition-all ${
                    isUnread 
                      ? 'bg-white border-blue-200 shadow-sm ring-1 ring-blue-500/10' 
                      : isArchived
                      ? 'bg-gray-50/60 border-gray-200/60 opacity-80'
                      : 'bg-white border-gray-200/80'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="cursor-pointer" onClick={() => openMessageDetail(msg)}>
                      <div className="flex items-center gap-2.5 mb-1.5">
                        {isUnread && (
                          <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0"></span>
                        )}
                        <h3 className="text-base font-bold text-graphite-950 hover:text-blue-600 transition-colors">{msg.name}</h3>
                        <span className="text-[11px] font-semibold px-2.5 py-0.5 bg-gray-100 text-graphite-700 rounded-md">
                          {msg.projectType || 'General Inquiry'}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-graphite-500">
                        <span className="font-medium text-graphite-800">{msg.email}</span>
                        {msg.budget && (
                          <span>· Budget: <strong className="text-graphite-900">{msg.budget}</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
                      <a
                        href={`mailto:${msg.email}?subject=Re: Portfolio Inquiry (${encodeURIComponent(msg.projectType || 'Design Project')})&body=Hi ${encodeURIComponent(msg.name)},%0D%0A%0D%0AThank you for getting in touch regarding ${encodeURIComponent(msg.projectType || 'your project')}!%0D%0A%0D%0AI would love to discuss how we can bring this to life.%0D%0A%0D%0ABest regards,%0D%0AZunayed Al Hasan`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-graphite-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Draft email reply"
                      >
                        <Reply size={14} />
                        <span>Reply</span>
                      </a>

                      <button 
                        onClick={() => handleStatusChange(msg.id, isUnread ? 'read' : 'unread')} 
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          isUnread ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                        }`}
                        title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                      >
                        {isUnread ? <CheckCircle2 size={18} /> : <RotateCcw size={18} />}
                      </button>

                      <button 
                        onClick={() => handleStatusChange(msg.id, isArchived ? 'read' : 'archived')} 
                        className="p-2 text-gray-400 hover:text-graphite-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                        title={isArchived ? 'Unarchive' : 'Archive'}
                      >
                        {isArchived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
                      </button>

                      <button 
                        onClick={() => triggerDelete(msg)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div 
                    onClick={() => openMessageDetail(msg)}
                    className="bg-gray-50/80 hover:bg-gray-100/60 p-4 rounded-xl border border-gray-100 text-xs text-graphite-800 leading-relaxed whitespace-pre-wrap cursor-pointer transition-colors"
                  >
                    {msg.message}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-graphite-400">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} />
                      {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recently received'}
                    </span>
                    <button
                      onClick={() => openMessageDetail(msg)}
                      className="font-bold text-graphite-600 hover:text-graphite-950"
                    >
                      View Full Details →
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Message Detail Drawer / Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite-950/40 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative border border-gray-100">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md">
                  Inquiry Detail
                </span>
                <h2 className="text-lg font-bold text-graphite-950 mt-1">
                  {selectedMessage.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="text-[10px] font-bold uppercase text-graphite-400">Sender Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="font-bold text-graphite-900 underline">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-graphite-400">Project Type</p>
                  <p className="font-bold text-graphite-900">{selectedMessage.projectType || 'General'}</p>
                </div>
                {selectedMessage.budget && (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-graphite-400">Budget Range</p>
                    <p className="font-bold text-emerald-700">{selectedMessage.budget}</p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-bold uppercase text-graphite-400">Current Status</p>
                  <span className="capitalize font-bold text-graphite-800">{selectedMessage.status}</span>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold uppercase text-graphite-500 mb-2">Message Body</p>
                <div className="p-4 bg-white border border-gray-200 rounded-xl leading-relaxed text-graphite-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, selectedMessage.status === 'read' ? 'unread' : 'read')}
                    className="px-3 py-2 text-xs font-semibold text-graphite-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                  >
                    {selectedMessage.status === 'read' ? 'Mark Unread' : 'Mark Read'}
                  </button>
                  <button
                    onClick={() => handleStatusChange(selectedMessage.id, selectedMessage.status === 'archived' ? 'read' : 'archived')}
                    className="px-3 py-2 text-xs font-semibold text-graphite-700 bg-gray-100 hover:bg-gray-200 rounded-xl"
                  >
                    {selectedMessage.status === 'archived' ? 'Unarchive' : 'Archive'}
                  </button>
                </div>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Portfolio Inquiry (${encodeURIComponent(selectedMessage.projectType || 'Project')})&body=Hi ${encodeURIComponent(selectedMessage.name)},%0D%0A%0D%0AThank you for getting in touch!`}
                  className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-graphite-950 hover:bg-graphite-800 rounded-xl shadow-xs"
                >
                  <Reply size={14} />
                  <span>Send Email Reply</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Delete Inquiry?"
        message={`Are you sure you want to permanently delete the message from ${msgToDelete?.name}?`}
        confirmLabel="Delete Message"
        isDestructive={true}
        isLoading={deleting}
        onConfirm={executeDelete}
        onCancel={() => {
          setConfirmOpen(false);
          setMsgToDelete(null);
        }}
      />
    </AdminLayout>
  );
}
