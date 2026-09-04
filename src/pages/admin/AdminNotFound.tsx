import React from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AlertCircle, LayoutDashboard, Globe } from 'lucide-react';

export function AdminNotFound() {
  return (
    <AdminLayout
      title="Admin 404"
      subtitle="Page Not Found"
    >
      <div className="bg-white rounded-3xl border border-gray-200/80 p-12 text-center max-w-xl mx-auto my-12 shadow-xs">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-100">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-black text-graphite-950 mb-2">Admin Page Not Found</h2>
        <p className="text-xs md:text-sm text-graphite-600 mb-8 leading-relaxed">
          The admin route you requested does not exist or has been moved. Please return to the CMS dashboard or visit the public website.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/Root"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-graphite-950 text-white text-xs font-bold rounded-xl hover:bg-graphite-800 transition-all shadow-xs"
          >
            <LayoutDashboard size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-graphite-700 text-xs font-bold rounded-xl hover:bg-gray-200 transition-all"
          >
            <Globe size={16} />
            <span>View Public Website</span>
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
