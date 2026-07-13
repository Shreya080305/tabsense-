import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, Clock, Activity, Pause, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Dashboard View page.
 * Renders quick usage stat cards, active track control banner, recent session lists,
 * and top domains horizontal chart bars.
 */
export const Dashboard: React.FC = () => {
  const stats = [
    { name: 'Active Sessions', value: '1', icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-950/20' },
    { name: 'Total Research Goals', value: '12', icon: BookOpen, color: 'text-brand-400', bg: 'bg-brand-950/20' },
    { name: 'Total Research Time', value: '14.5 hrs', icon: Clock, color: 'text-violet-400', bg: 'bg-violet-950/20' },
  ];

  const mockActiveSession = {
    id: 'session-123',
    goal: 'Master Spring Security Filters',
    description: 'Studying filter chains, custom AuthenticationProvider, and security contexts.',
    status: 'ACTIVE',
    startTime: '2026-07-11T12:00:00Z',
    tabsCount: 6,
  };

  const recentSessions = [
    { id: '1', goal: 'React Router v6 Data APIs', status: 'COMPLETED', date: '2026-07-10', duration: '2h 15m', tabs: 8 },
    { id: '2', goal: 'PostgreSQL Index Optimization', status: 'PAUSED', date: '2026-07-09', duration: '4h 30m', tabs: 15 },
    { id: '3', goal: 'Tailwind Grid Configurations', status: 'COMPLETED', date: '2026-07-08', duration: '1h 45m', tabs: 4 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Introduction Area */}
      <div>
        <h2 className="text-xl font-bold text-white">Workspace Overview</h2>
        <p className="text-sm text-dark-400">Track and recover your active research contexts.</p>
      </div>

      {/* Numerical Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name} className="flex items-center gap-4 bg-dark-900/30">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-dark-400">{stat.name}</p>
              <p className="text-2xl font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Highlight active session card */}
      {mockActiveSession && (
        <Card className="relative overflow-hidden border-brand-500/20 bg-gradient-to-r from-brand-950/20 via-dark-900/40 to-dark-900/20">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 to-transparent" />
          
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/40 border border-emerald-800/30 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Session Running
              </span>
              <h3 className="text-lg font-bold text-white mt-2">{mockActiveSession.goal}</h3>
              <p className="text-sm text-dark-300 max-w-2xl">{mockActiveSession.description}</p>
              <div className="flex items-center gap-4 text-xs text-dark-400 pt-1">
                <span>Tabs Tracked: <strong className="text-white">{mockActiveSession.tabsCount}</strong></span>
                <span>•</span>
                <span>Session Started: <strong className="text-white">12:00 PM</strong></span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <Pause className="h-4 w-4" /> Pause
              </Button>
              <Button variant="primary" size="sm" className="gap-1.5">
                <CheckCircle className="h-4 w-4" /> Complete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Bottom rows content */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* Left Side: Session histories */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-white">Recent Research Sessions</h3>
            <Link to="/sessions" className="text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
              View All Sessions &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentSessions.map((session) => (
              <Link key={session.id} to={`/sessions/${session.id}`} className="block">
                <Card hoverable className="p-4 bg-dark-900/20">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white">{session.goal}</h4>
                      <div className="flex items-center gap-3 text-xs text-dark-400">
                        <span>{session.date}</span>
                        <span>•</span>
                        <span>{session.duration}</span>
                        <span>•</span>
                        <span>{session.tabs} tabs</span>
                      </div>
                    </div>
                    <span className={`rounded-md px-2 py-0.5 text-xs font-semibold ${
                      session.status === 'COMPLETED'
                        ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-900/40'
                        : 'bg-amber-950/30 text-amber-400 border border-amber-900/40'
                    }`}>
                      {session.status}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Right Side: Domain aggregation chart */}
        <div className="space-y-4">
          <h3 className="text-base font-semibold text-white">Top Research Domains</h3>
          <Card className="bg-dark-900/20 space-y-4">
            <div className="space-y-3">
              {[
                { domain: 'github.com', time: '4h 12m', pct: 60 },
                { domain: 'stackoverflow.com', time: '2h 10m', pct: 35 },
                { domain: 'spring.io', time: '1h 05m', pct: 15 },
              ].map((item) => (
                <div key={item.domain} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{item.domain}</span>
                    <span className="text-dark-400">{item.time}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-dark-850">
                    <div
                      className="h-1.5 rounded-full bg-brand-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
