import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

/**
 * 404 Page Not Found Component.
 * Styled with custom brand vectors and quick redirection actions to return back.
 */
export const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-dark-950 p-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-lg shadow-brand-500/20 mb-6">
        <Layers className="h-6 w-6 text-white" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">404</h1>
      <h2 className="mt-2 text-lg font-semibold text-dark-200">Page Not Found</h2>
      <p className="mt-2 text-sm text-dark-400 max-w-xs">The route you are trying to visit does not exist or has been moved.</p>
      
      <div className="mt-8">
        <Link to="/dashboard">
          <Button variant="primary" className="gap-2">
            Back to Dashboard <ArrowRight className="h-4.5 w-4.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
