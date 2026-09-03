import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Mail, Briefcase, Layers, FileText } from 'lucide-react';

export function AdminDashboard() {
  return (
    <AdminLayout title="Overview">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Projects', val: '12', icon: <Briefcase size={20} className="text-blue-500" /> },
          { label: 'Active Services', val: '4', icon: <Layers size={20} className="text-purple-500" /> },
          { label: 'Unread Messages', val: '3', icon: <Mail size={20} className="text-orange-500" /> },
          { label: 'Certificates', val: '5', icon: <FileText size={20} className="text-green-500" /> }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-graphite-500 mb-2">{stat.label}</p>
              <p className="text-3xl font-semibold text-graphite-900">{stat.val}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-graphite-900">Recent Activity</h2>
        </div>
        <div className="p-12 text-center text-graphite-500">
          <Mail size={48} className="mx-auto mb-4 opacity-20" />
          <p>Everything is up to date.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
