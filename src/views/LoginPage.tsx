'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearAuthError, login } from '../store/slices/authSlice';
import { FormField } from '../components/forms/FormField';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { status, error, user } = useAppSelector((s) => s.auth);

  // Tab state: 'client' | 'owner'
  const isOwnerUrl = pathname.includes('/owner');
  const [activeTab, setActiveTab] = useState<'client' | 'owner'>(isOwnerUrl ? 'owner' : 'client');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/');
      }
    }
  }, [user, router]);

  const fillClientData = () => {
    setActiveTab('client');
    setValue('email', 'demo@rajaconstruction.com', { shouldValidate: true, shouldDirty: true });
    setValue('password', 'password123', { shouldValidate: true, shouldDirty: true });
  };

  const fillOwnerData = () => {
    setActiveTab('owner');
    setValue('email', 'owner@rajaconstruction.com', { shouldValidate: true, shouldDirty: true });
    setValue('password', 'ownerpassword123', { shouldValidate: true, shouldDirty: true });
  };

  const onSubmit = (values: FormValues) => {
    dispatch(login(values));
  };

  return (
    <div className="container-xl py-20 max-w-lg">
      {/* Role Selection Tabs */}
      <div className="flex border-b border-emerald-900/10 mb-8">
        <button
          type="button"
          onClick={() => setActiveTab('client')}
          className={`flex-1 py-3 text-center text-xs uppercase tracking-[0.2em] font-semibold border-b-2 transition-colors ${
            activeTab === 'client'
              ? 'border-emerald-800 text-emerald-900'
              : 'border-transparent text-stone/60 hover:text-emerald-900'
          }`}
        >
          Client Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('owner')}
          className={`flex-1 py-3 text-center text-xs uppercase tracking-[0.2em] font-semibold border-b-2 transition-colors ${
            activeTab === 'owner'
              ? 'border-ruby text-ruby'
              : 'border-transparent text-stone/60 hover:text-ruby'
          }`}
        >
          🏢 Owner / Seller Portal
        </button>
      </div>

      <span className="label-eyebrow mb-2 block">
        {activeTab === 'owner' ? 'Property Management Access' : 'Welcome Back'}
      </span>
      <h1 className="font-display text-3xl md:text-4xl mb-3">
        {activeTab === 'owner' ? 'Owner Login' : 'Client Sign In'}
      </h1>
      <p className="text-stone text-sm mb-6">
        {activeTab === 'owner'
          ? 'Sign in to your owner dashboard to upload property images, manage details, and track buyer inquiries.'
          : 'Access your account to save luxury listings, schedule private visits, and manage your shortlisted properties.'}
      </p>

      {/* Demo Credentials Box */}
      <div
        className={`border p-4 rounded mb-8 space-y-3 transition-colors ${
          activeTab === 'owner' ? 'bg-ruby/5 border-ruby/20' : 'bg-emerald-900/5 border-emerald-900/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone">
            {activeTab === 'owner' ? '🔑 Demo Owner Account' : '🔑 Demo Client Account'}
          </span>
          <button
            type="button"
            onClick={activeTab === 'owner' ? fillOwnerData : fillClientData}
            className={`text-[12px] font-medium hover:underline ${
              activeTab === 'owner' ? 'text-ruby' : 'text-emerald-800'
            }`}
          >
            Autofill {activeTab === 'owner' ? 'Owner' : 'Client'} Data
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            type="button"
            onClick={fillClientData}
            className={`px-3 py-1.5 border text-xs font-mono transition-colors rounded ${
              activeTab === 'client'
                ? 'bg-emerald-800 text-white border-emerald-800'
                : 'bg-white text-stone border-emerald-900/20 hover:border-emerald-800'
            }`}
          >
            Client: demo@rajaconstruction.com
          </button>
          <button
            type="button"
            onClick={fillOwnerData}
            className={`px-3 py-1.5 border text-xs font-mono transition-colors rounded ${
              activeTab === 'owner'
                ? 'bg-ruby text-white border-ruby'
                : 'bg-white text-stone border-ruby/20 hover:border-ruby'
            }`}
          >
            Owner: owner@rajaconstruction.com
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          label="Email Address"
          type="email"
          placeholder={activeTab === 'owner' ? 'owner@rajaconstruction.com' : 'you@example.com'}
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        {error && <p className="field-error !mt-0">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full disabled:opacity-60 ${activeTab === 'owner' ? 'btn-red' : 'btn-primary'}`}
        >
          {status === 'loading'
            ? 'Authenticating…'
            : activeTab === 'owner'
            ? 'Sign In to Owner Portal'
            : 'Sign In'}
        </button>
      </form>

      <p className="text-[13px] text-stone mt-8">
        Don't have an account?{' '}
        <Link href="/signup" className="text-ruby underline underline-offset-4 font-medium">
          Create one now
        </Link>
      </p>
    </div>
  );
}
