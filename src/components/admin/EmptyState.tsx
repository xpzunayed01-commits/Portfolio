import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="py-20 px-6 text-center bg-white rounded-3xl border border-gray-200/80 shadow-xs flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-graphite-400 mb-4">
        <Icon size={28} className="stroke-1" />
      </div>
      <h3 className="text-base font-bold text-graphite-900 mb-1">{title}</h3>
      <p className="text-xs text-graphite-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 text-xs font-bold text-white bg-graphite-900 hover:bg-graphite-800 rounded-xl transition-all shadow-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
