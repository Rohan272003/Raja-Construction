'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearAuthError, login, signup } from '../store/slices/authSlice';
import { FormField } from '../components/forms/FormField';

// ─── Schemas ────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z
  .object({
    name: z.string().min(2, 'Please enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type LoginValues = z.infer<typeof loginSchema>;
type SignupValues = z.infer<typeof signupSchema>;

// ─── Props ───────────────────────────────────────────────────────────────────

interface AuthPageProps {
  defaultMode?: 'login' | 'signup';
}

// ─── Left Panel Decoration ───────────────────────────────────────────────────

function LeftPanel({ mode }: { mode: 'login' | 'signup' }) {
  return (
    <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-charcoal to-charcoal-soft">
      {/* Decorative circles */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 blur-3xl bg-emerald-400" />
      <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full opacity-10 blur-3xl bg-ruby-bright" />

      {/* Logo */}
      <div className="relative z-10">
        <Link href="/" className="font-display text-2xl tracking-wide flex items-center gap-1.5">
          <span className="text-emerald-bright font-bold">RAJA</span>
          <span className="text-ruby-bright italic font-serif">Construction</span>
        </Link>
      </div>

      {/* Center content */}
      <div className="relative z-10 space-y-6">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl bg-emerald-800/40">
          🏡
        </div>
        <h2 className="font-display text-4xl text-ivory leading-tight">
          {mode === 'signup' ? 'Join Raja Estates' : 'Welcome'}
        </h2>
        <p className="text-ivory/60 text-sm leading-relaxed max-w-xs">
          {mode === 'signup'
            ? 'Create your account to save luxury listings, schedule private visits, and manage your shortlisted properties across Erode.'
            : 'Access your account to save luxury listings, schedule private visits, and manage your shortlisted properties.'}
        </p>

        {/* Stats row */}
        <div className="flex gap-6 pt-4">
          {[
            { value: '200+', label: 'Properties' },
            { value: '50+', label: 'Locations' },
            { value: '1000+', label: 'Happy Clients' },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-display text-2xl text-emerald-bright">
                {s.value}
              </p>
              <p className="text-ivory/50 text-xs uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <p className="relative z-10 text-ivory/30 text-[11px] uppercase tracking-[0.3em]">
        Erode's Premier Real Estate
      </p>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({
  onSwitchToSignup,
}: {
  onSwitchToSignup: () => void;
}) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const autofill = (r: 'client' | 'owner') => {
    if (r === 'client') {
      setValue('email', 'demo@rajaconstruction.com', { shouldValidate: true, shouldDirty: true });
      setValue('password', 'password123', { shouldValidate: true, shouldDirty: true });
    } else {
      setValue('email', 'owner@rajaconstruction.com', { shouldValidate: true, shouldDirty: true });
      setValue('password', 'ownerpassword123', { shouldValidate: true, shouldDirty: true });
    }
  };

  const onSubmit = (values: LoginValues) => {
    dispatch(login(values));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Demo credentials */}
      <div className="border border-emerald-900/10 rounded-lg p-4 bg-emerald-50/30 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone">
            🔑 Demo Login Shortcuts
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => autofill('client')}
            className="px-3 py-1.5 bg-white text-stone border border-emerald-900/15 hover:border-emerald-700 text-[11px] font-medium rounded transition-colors"
          >
            Client: demo@rajaconstruction.com
          </button>
          <button
            type="button"
            onClick={() => autofill('owner')}
            className="px-3 py-1.5 bg-white text-stone border border-ruby/15 hover:border-ruby text-[11px] font-medium rounded transition-colors"
          >
            Owner: owner@rajaconstruction.com
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
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
          id="auth-signin-submit"
          className="w-full disabled:opacity-60 transition-all btn-primary"
        >
          {status === 'loading' ? 'Authenticating…' : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-[13px] text-stone">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="text-ruby underline underline-offset-4 font-medium hover:text-ruby-deep"
        >
          Create one now
        </button>
      </p>
    </div>
  );
}

// ─── Signup Form ──────────────────────────────────────────────────────────────

function SignupForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = (values: SignupValues) => {
    dispatch(signup({ name: values.name, email: values.email, password: values.password }));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          label="Full Name"
          placeholder="Jane Whitfield"
          required
          error={errors.name?.message}
          {...register('name')}
        />
        <FormField
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            label="Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <FormField
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            required
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {error && <p className="field-error !mt-0">{error}</p>}

        <button
          type="submit"
          disabled={status === 'loading'}
          id="auth-signup-submit"
          className="btn-primary w-full disabled:opacity-60"
        >
          {status === 'loading' ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-[13px] text-stone">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-ruby underline underline-offset-4 font-medium hover:text-ruby-deep"
        >
          Sign in
        </button>
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthContent({ defaultMode = 'login' }: AuthPageProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAppSelector((s) => s.auth);
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      const from = searchParams.get('from');
      if (from) {
        router.push(from);
      } else if (user.role === 'owner') {
        router.push('/owner/dashboard');
      } else {
        router.push('/account');
      }
    }
  }, [user, router, searchParams]);

  return (
    <div className="min-h-[calc(100vh-80px)] grid lg:grid-cols-[1fr_1fr] xl:grid-cols-[5fr_7fr]">
      {/* Left decorative panel */}
      <LeftPanel mode={mode} />

      {/* Right form panel */}
      <div className="flex flex-col justify-center px-6 py-16 md:px-12 xl:px-20 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1 mb-8 border-b border-stone/10">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  dispatch(clearAuthError());
                }}
                className={`pb-3 px-1 mr-4 text-sm font-semibold uppercase tracking-[0.2em] border-b-2 transition-all -mb-px ${
                  mode === m
                    ? 'border-ruby text-charcoal'
                    : 'border-transparent text-stone/60 hover:text-charcoal'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8">
            <span className="label-eyebrow mb-2 block">
              {mode === 'signup' ? 'Join Raja Estates' : 'Welcome'}
            </span>
            <h1 className="font-display text-3xl md:text-4xl text-charcoal">
              {mode === 'signup' ? 'Create your account' : 'Sign in to continue'}
            </h1>
          </div>

          {/* Forms */}
          {mode === 'login' ? (
            <LoginForm
              onSwitchToSignup={() => {
                setMode('signup');
                dispatch(clearAuthError());
              }}
            />
          ) : (
            <SignupForm
              onSwitchToLogin={() => {
                setMode('login');
                dispatch(clearAuthError());
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export function AuthPage(props: AuthPageProps) {
  return (
    <Suspense fallback={<div className="container-xl py-32 text-center text-stone">Loading...</div>}>
      <AuthContent {...props} />
    </Suspense>
  );
}
