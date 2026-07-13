import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { User, Shield, Info, Chrome } from 'lucide-react';

/**
 * Profile Settings page.
 * Loads user metadata details from mock storage.
 * Demonstrates pairing status displays for the Chrome extension sync workflows.
 */
export const Profile: React.FC = () => {
  const rawUser = localStorage.getItem('tabsense_user');
  const user = rawUser ? JSON.parse(rawUser) : { name: 'Developer User', email: 'dev@tabsense.com' };
  
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
    }
  });

  const onSubmit = (data: any) => {
    localStorage.setItem('tabsense_user', JSON.stringify({
      ...user,
      name: data.name,
      email: data.email,
    }));
    alert('Profile configurations updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
        <p className="text-sm text-dark-400">Manage your identity metadata and extension integrations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Core Profile Fields Form */}
        <Card className="glass-panel border-dark-800/80">
          <div className="mb-4 flex items-center gap-2 border-b border-dark-800 pb-4">
            <User className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-semibold text-white">Personal Information</h3>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  {...register('email')}
                  className="w-full rounded-lg border border-dark-850 bg-dark-950/20 px-3.5 py-2 text-sm text-dark-450 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Pairing Status indicators */}
        <Card className="bg-dark-900/20">
          <div className="mb-4 flex items-center gap-2 border-b border-dark-800/60 pb-4">
            <Chrome className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-semibold text-white">Browser Extension Integration</h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">TabSense Chrome Extension</p>
              <p className="text-xs text-dark-400">Integrate the tracking client to automatically sync active browser workspaces.</p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-950/40 border border-emerald-900/40 px-2 py-0.5 text-xs text-emerald-400">
                Paired & Syncing
              </span>
            </div>
          </div>
        </Card>

        {/* JWT security descriptions */}
        <Card className="bg-dark-900/20">
          <div className="mb-4 flex items-center gap-2 border-b border-dark-800/60 pb-4">
            <Shield className="h-5 w-5 text-brand-400" />
            <h3 className="text-base font-semibold text-white">Session Security</h3>
          </div>

          <div className="flex items-start gap-3 text-xs text-dark-400">
            <Info className="h-4.5 w-4.5 text-brand-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white mb-1">Your sessions are protected via JWT filters</p>
              <p>JWT credentials authenticate Chrome extensions and web client dashboards. Session tokens expire in 24 hours.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
