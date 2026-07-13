import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

/**
 * Main Layout wrapper for Authenticated users.
 * Connects the persistent Sidebar and Navbar modules.
 * Leverages state hooks to synchronize responsive sidebar toggle state on mobile viewports.
 * Houses the React Router DOM <Outlet /> component for rendering views dynamically.
 */
export const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dark-950">
      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Workspace */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable layout area containing pages */}
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-dark-950 to-dark-900/60">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
