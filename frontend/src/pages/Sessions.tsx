import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useForm } from 'react-hook-form';
import { BookOpen, Search, Plus, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Sessions Listing page.
 * Implements client-side state mutation to mock creating active/paused session logs.
 * Includes interactive filtering (by status badge) and input matching queries.
 */
export const Sessions: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAUSED' | 'COMPLETED'>('ALL');
  const [search, setSearch] = useState('');
  const { register, handleSubmit, reset } = useForm();

  // Seed data showing multiple status logs
  const [sessions, setSessions] = useState([
    { id: '1', goal: 'React Router v6 Data APIs', description: 'Testing loader and action functionalities.', status: 'COMPLETED', date: '2026-07-10', duration: '2h 15m', tabs: 8 },
    { id: '2', goal: 'PostgreSQL Index Optimization', description: 'Examining B-Tree indexes and EXPLAIN ANALYZE queries.', status: 'PAUSED', date: '2026-07-09', duration: '4h 30m', tabs: 15 },
    { id: '3', goal: 'Tailwind Grid Configurations', description: 'Building fluid grid rows for responsiveness.', status: 'COMPLETED', date: '2026-07-08', duration: '1h 45m', tabs: 4 },
  ]);

  const onSubmit = (data: any) => {
    const newSession = {
      id: String(sessions.length + 1),
      goal: data.goal,
      description: data.description,
      status: 'ACTIVE' as const,
      date: new Date().toISOString().split('T')[0],
      duration: '0m',
      tabs: 0,
    };
    // Reset former ACTIVE sessions to PAUSED state to enforce single active session constraint
    setSessions([
      newSession,
      ...sessions.map(s => s.status === 'ACTIVE' ? { ...s, status: 'PAUSED' as const } : s)
    ]);
    reset();
  };

  const filteredSessions = sessions.filter(s => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch = s.goal.toLowerCase().includes(search.toLowerCase()) || 
                          s.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-white">Research Sessions</h2>
        <p className="text-sm text-dark-400">Initialize research sessions or restore your previous environments.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Form: Create Session Goal */}
        <div className="lg:col-span-1">
          <Card className="glass-panel border-dark-800/80 sticky top-6">
            <div className="mb-4 flex items-center gap-2">
              <Plus className="h-5 w-5 text-brand-400" />
              <h3 className="text-base font-semibold text-white">Start New Session</h3>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                  Research Goal
                </label>
                <input
                  type="text"
                  required
                  {...register('goal')}
                  placeholder="e.g. Understand JWT Verification"
                  className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  {...register('description')}
                  placeholder="What are you attempting to solve or research?"
                  className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500 resize-none"
                />
              </div>

              <Button type="submit" variant="primary" className="w-full">
                Launch Session
              </Button>
            </form>
          </Card>
        </div>

        {/* Right List: Display of all tracking histories */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Query Filters Capsule */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-dark-900/10 p-3 rounded-xl border border-dark-800/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-dark-550" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search goals or descriptions..."
                className="w-full rounded-lg border border-dark-800/80 bg-dark-950/40 py-2 pl-9 pr-4 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500"
              />
            </div>

            <div className="flex flex-wrap gap-1">
              {(['ALL', 'ACTIVE', 'PAUSED', 'COMPLETED'] as const).map((btn) => (
                <button
                  key={btn}
                  onClick={() => setFilter(btn)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    filter === btn
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                      : 'text-dark-400 hover:bg-dark-900 hover:text-dark-100'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Stack */}
          <div className="space-y-3">
            {filteredSessions.length > 0 ? (
              filteredSessions.map((session) => (
                <Link key={session.id} to={`/sessions/${session.id}`} className="block">
                  <Card hoverable className="p-5 bg-dark-900/20">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-semibold text-white">{session.goal}</h4>
                          <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
                            session.status === 'ACTIVE'
                              ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/50'
                              : session.status === 'PAUSED'
                              ? 'bg-amber-950/50 text-amber-400 border border-amber-900/50'
                              : 'bg-dark-800 text-dark-400 border border-dark-700'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <p className="text-sm text-dark-400 line-clamp-1">{session.description}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-dark-400 border-t border-dark-800/40 pt-2 sm:border-0 sm:pt-0">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" /> {session.date}
                        </span>
                        <span>•</span>
                        <span>{session.tabs} tabs</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))
            ) : (
              <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-dark-800/80 bg-transparent">
                <BookOpen className="h-10 w-10 text-dark-600 mb-3" />
                <p className="text-sm font-medium text-dark-350">No sessions match the criteria</p>
                <p className="text-xs text-dark-500 mt-1">Try expanding your search query or starting a new session goal.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
