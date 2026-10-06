import React from 'react';

export const AuthLoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-sm font-medium text-on-surface-variant">Loading Fuega Academy...</p>
      </div>
    </div>
  );
};
