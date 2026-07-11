import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

/**
 * Login Page component.
 * Integrates React Hook Form for inputs validation.
 * Sets mock session parameters in local storage to allow workspace previewing.
 */
export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Route to navigate back to post authentication
  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = (data: any) => {
    // Simulate login for this frontend foundation milestone
    localStorage.setItem('tabsense_token', 'mock_jwt_token_for_tabsense');
    localStorage.setItem('tabsense_user', JSON.stringify({
      name: data.name || 'Developer User',
      email: data.email,
    }));
    navigate(from, { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-dark-950 p-4">
      <div className="w-full max-w-md">
        
        {/* Page Brand Logo Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 to-brand-500 shadow-lg shadow-brand-500/20">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-1 text-sm text-dark-400">Preserve and manage your research context</p>
        </div>

        {/* Card and Auth inputs Form */}
        <Card className="glass-panel border-dark-800/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                Display Name (Optional)
              </label>
              <input
                type="text"
                {...register('name')}
                placeholder="Enter Name"
                className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { required: 'Email address is required' })}
                placeholder="Enter Email"
                className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">{errors.email.message as string}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-dark-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                {...register('password', { required: 'Password is required' })}
                placeholder="Enter Password"
                className="w-full rounded-lg border border-dark-800 bg-dark-950/40 px-3.5 py-2 text-sm text-white placeholder-dark-600 outline-none transition-all focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">{errors.password.message as string}</p>
              )}
            </div>

            <Button type="submit" variant="primary" className="w-full mt-2">
              Sign In
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
