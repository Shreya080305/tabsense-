import React from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface NavbarProps {
  onMenuClick: () => void;
}

/**
 * Top Navigation Bar component.
 * Houses page context breadcrumbs, notifications indicator, and current user identity.
 * Contains drawer menu toggle button for responsive layouts.
 */
export const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const location = useLocation();
  const rawUser = localStorage.getItem('tabsense_user');
  
  // Provide robust local developer default objects for static initialization
  const user = rawUser ? JSON.parse(rawUser) : { name: 'Developer User', email: 'dev@tabsense.com' };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/dashboard')) return 'Dashboard Overview';
    if (path.startsWith('/sessions')) {
      if (path.match(/\/sessions\/.+/)) return 'Session Details';
      return 'Research Sessions';
    }
    if (path.startsWith('/profile')) return 'Profile Settings';
    return 'TabSense';
  };

  return (
    <header className="flex h-16 items-center justify-between border-b border-dark-800/80 bg-dark-950/20 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        {/* Mobile menu toggle trigger button */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-1.5 text-dark-400 hover:bg-dark-900 hover:text-dark-100 lg:hidden focus:outline-none focus:ring-2 focus:ring-brand-500"
          aria-label="Toggle Navigation Drawer"
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-md font-semibold text-white tracking-wide">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Simulated Inbox Alert trigger */}
        <button className="relative rounded-lg p-1.5 text-dark-400 hover:bg-dark-900 hover:text-dark-100 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
        </button>

        {/* User Identity Capsule */}
        <div className="flex items-center gap-3 border-l border-dark-800/80 pl-4">
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-dark-400">{user.email}</p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-dark-900 border border-dark-800 text-dark-200">
            <User className="h-4.5 w-4.5" />
          </div>
        </div>
      </div>
    </header>
  );
};
