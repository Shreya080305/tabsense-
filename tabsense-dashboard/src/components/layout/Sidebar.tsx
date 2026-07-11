import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, User, LogOut, X, Layers } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Responsive Sidebar Navigation component.
 * Displays application logo, links to dashboard pages, active status highlights, and log-out controls.
 */
export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Research Sessions', path: '/sessions', icon: BookOpen },
    { name: 'Profile Settings', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    localStorage.removeItem('tabsense_token');
    localStorage.removeItem('tabsense_user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Drawer Overlay for Mobile Viewports */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-dark-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Drawer Container */}
      <aside
        className={cn(
          "fixed bottom-0 top-0 left-0 z-50 flex w-64 flex-col border-r border-dark-800/80 bg-dark-950 p-4 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 glass-panel",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-md shadow-brand-500/20">
              <Layers className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-white to-dark-300 bg-clip-text text-transparent">
              TabSense
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-dark-400 hover:bg-dark-800 hover:text-dark-100 lg:hidden"
            aria-label="Close Sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="mt-8 flex-1 space-y-1 px-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose()}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-brand-600/10 border-l-2 border-brand-500 text-brand-400 pl-4 bg-gradient-to-r from-brand-900/10 to-transparent"
                    : "text-dark-400 hover:bg-dark-900 hover:text-dark-100"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Footer Settings Area */}
        <div className="border-t border-dark-800/80 pt-4">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-950/20 hover:text-red-300"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
};
