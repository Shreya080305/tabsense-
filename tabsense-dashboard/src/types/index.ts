export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type SessionStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED';

export interface Session {
  id: string;
  userId: string;
  goal: string;
  description: string;
  status: SessionStatus;
  startTime: string;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
  tabs?: Tab[];
}

export interface Tab {
  id: string;
  sessionId: string;
  url: string;
  title: string;
  openTime: string;
  closeTime: string | null;
  activeDurationSeconds: number;
  isRestored: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface AnalyticsOverview {
  activeSessionsCount: number;
  completedSessionsCount: number;
  totalResearchTimeSeconds: number;
  timeSpentPerSession: Array<{
    sessionId: string;
    goal: string;
    seconds: number;
  }>;
}

export interface TopDomain {
  domain: string;
  activeDurationSeconds: number;
  visitCount: number;
}
