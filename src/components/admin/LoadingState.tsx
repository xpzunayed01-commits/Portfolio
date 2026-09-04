import React from 'react';

export function LoadingState({ message = 'Loading data...' }: { message?: string }) {
  return (
    <div className="py-24 flex flex-col items-center justify-center gap-4">
      <div className="animate-spin rounded-full h-9 w-9 border-2 border-graphite-900 border-t-transparent"></div>
      <p className="text-xs font-semibold text-graphite-500 uppercase tracking-wider">{message}</p>
    </div>
  );
}
