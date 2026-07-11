import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Sessions } from '@/pages/Sessions';
import { SessionDetails } from '@/pages/SessionDetails';
import { Profile } from '@/pages/Profile';
import { NotFound } from '@/pages/NotFound';

/**
 * Global Router definition using React Router DOM Data API (v6+).
 * Organizes routes into clean Public (Login), Protected Layout nested routes, and Fallbacks (404).
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'sessions',
        element: <Sessions />,
      },
      {
        path: 'sessions/:id',
        element: <SessionDetails />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
