import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, RefreshCw, ExternalLink, Calendar, Clock } from 'lucide-react';

/**
 * Session Details page.
 * Loads parameter IDs to render specific goal configurations.
 * Formats duration and outlines mock browser tab logs with restoration events.
 */
export const SessionDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  // Mock mapping representing detailed research records
  const session = {
    id: id || '1',
    goal: id === '2' ? 'PostgreSQL Index Optimization' : id === '3' ? 'Tailwind Grid Configurations' : 'React Router v6 Data APIs',
    description: 'Testing loader and action functionalities for data fetching and layout validation.',
    status: id === '2' ? 'PAUSED' : 'COMPLETED',
    date: '2026-07-10',
    duration: '2h 15m',
    tabs: [
      { id: 't1', title: 'React Router Tutorial', url: 'https://reactrouter.com/en/main/start/tutorial', activeDuration: 2800, isRestored: false },
      { id: 't2', title: 'Data Fetching in React Router', url: 'https://reactrouter.com/en/main/guides/data-fetching', activeDuration: 3600, isRestored: true },
      { id: 't3', title: 'StackOverflow: Route parameters empty', url: 'https://stackoverflow.com/questions/react-router-params', activeDuration: 850, isRestored: false },
      { id: 't4', title: 'GitHub repo: router loaders', url: 'https://github.com/remix-run/react-router/issues', activeDuration: 1200, isRestored: false },
    ],
  };

  const handleRestore = () => {
    alert(`Restoring ${session.tabs.length} tabs into your browser context...`);
  };

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  return (
    <div className="space-y-6">
      
      {/* Navigation Breadcrumb */}
      <div>
        <Link to="/sessions" className="inline-flex items-center gap-1.5 text-xs text-dark-400 hover:text-white transition-colors mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Sessions
        </Link>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{session.goal}</h2>
              <span className={`rounded px-2 py-0.5 text-xs font-semibold ${
                session.status === 'COMPLETED' 
                  ? 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-400' 
                  : 'bg-amber-950/40 border border-amber-900/40 text-amber-400'
              }`}>
                {session.status}
              </span>
            </div>
            <p className="text-sm text-dark-400">{session.description}</p>
          </div>
          <div>
            <Button variant="primary" onClick={handleRestore} className="gap-2 bg-gradient-to-tr from-brand-700 to-brand-500 shadow-brand-500/10">
              <RefreshCw className="h-4.5 w-4.5" /> Restore Session Tabs
            </Button>
          </div>
        </div>
      </div>

      {/* Info row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Card className="bg-dark-900/20 p-4 flex items-center gap-3">
          <Calendar className="h-5 w-5 text-brand-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Date Tracked</p>
            <p className="text-sm font-semibold text-white mt-0.5">{session.date}</p>
          </div>
        </Card>
        
        <Card className="bg-dark-900/20 p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-brand-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Active Duration</p>
            <p className="text-sm font-semibold text-white mt-0.5">{session.duration}</p>
          </div>
        </Card>
        
        <Card className="bg-dark-900/20 p-4 flex items-center gap-3">
          <ExternalLink className="h-5 w-5 text-brand-400" />
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-dark-500">Tabs Captured</p>
            <p className="text-sm font-semibold text-white mt-0.5">{session.tabs.length} Tabs</p>
          </div>
        </Card>
      </div>

      {/* List Table of Tabs */}
      <Card className="bg-dark-900/20 p-0 overflow-hidden">
        <div className="border-b border-dark-800/80 px-6 py-4">
          <h3 className="text-sm font-semibold text-white">Captured Browser Tabs</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm text-dark-250">
            <thead className="bg-dark-950/40 text-xs font-semibold uppercase tracking-wider text-dark-400 border-b border-dark-850">
              <tr>
                <th className="px-6 py-3.5">Title & Link</th>
                <th className="px-6 py-3.5">Active Time</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-850">
              {session.tabs.map((tab) => (
                <tr key={tab.id} className="hover:bg-dark-900/10">
                  <td className="px-6 py-4 max-w-md">
                    <p className="font-semibold text-white truncate">{tab.title}</p>
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-dark-400 hover:text-brand-400 truncate block mt-0.5 transition-colors"
                    >
                      {tab.url}
                    </a>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono">{formatDuration(tab.activeDuration)}</td>
                  <td className="px-6 py-4">
                    {tab.isRestored ? (
                      <span className="rounded bg-brand-950/40 border border-brand-900/40 px-2 py-0.5 text-[10px] font-medium text-brand-400">
                        Restored
                      </span>
                    ) : (
                      <span className="text-[10px] text-dark-500 px-2 py-0.5 bg-dark-850 rounded border border-dark-800">
                        Captured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href={tab.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-dark-800 bg-dark-900/80 px-2.5 py-1.5 text-xs text-dark-300 hover:bg-dark-800 hover:text-white transition-colors"
                    >
                      Open Link <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
