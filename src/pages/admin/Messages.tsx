import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { motion } from 'motion/react';
import { Mail, Trash2, CheckCircle } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contactMessages'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    await updateDoc(doc(db, 'contactMessages', id), { status: 'read' });
  };

  const deleteMessage = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      await deleteDoc(doc(db, 'contactMessages', id));
    }
  };

  return (
    <AdminLayout title="Messages">
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl w-full"></div>)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-32 bg-white rounded-3xl border border-gray-100">
          <Mail className="mx-auto h-16 w-16 text-gray-200 mb-4" />
          <h3 className="text-xl font-medium text-graphite-900">No messages yet</h3>
          <p className="text-graphite-500 mt-2">When someone contacts you, their message will appear here.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className={`p-8 rounded-3xl border transition-all ${
                msg.status === 'unread' 
                  ? 'bg-white border-blue-100 shadow-md shadow-blue-500/5' 
                  : 'bg-gray-50 border-gray-100 opacity-80'
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-graphite-900">{msg.name}</h3>
                    {msg.status === 'unread' && (
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    )}
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-sm font-medium text-graphite-500 hover:text-graphite-900 transition-colors">{msg.email}</a>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 mr-2">
                    <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-wider rounded-full text-graphite-600">
                      {msg.projectType}
                    </span>
                    <span className="px-3 py-1 bg-white border border-gray-200 text-[10px] font-bold uppercase tracking-wider rounded-full text-graphite-600">
                      {msg.budget}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {msg.status === 'unread' && (
                      <button 
                        onClick={() => markAsRead(msg.id)} 
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" 
                        title="Mark as read"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                    <button 
                      onClick={() => deleteMessage(msg.id)} 
                      className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
              <div className="bg-white/50 p-6 rounded-2xl border border-gray-100/50">
                <p className="text-graphite-700 whitespace-pre-wrap leading-relaxed">{msg.message}</p>
              </div>
              <div className="mt-4 text-[10px] text-graphite-400 font-medium">
                {msg.createdAt?.toDate().toLocaleString() || 'Just now'}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
