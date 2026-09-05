'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { clearAuthError, signup } from '../store/slices/authSlice';
import { FormField } from '../components/forms/FormField';

const schema = z
  .object({
    name: z.string().min(2, 'Please enter your full name'),
    email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormValues = z.infer<typeof schema>;

export function SignupPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { status, error, user } = useAppSelector((s) => s.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const onSubmit = (values: FormValues) => {
    dispatch(signup({ name: values.name, email: values.email, password: values.password }));
  };

  return (
    <div className="container-xl py-24 max-w-md">
      <span className="label-eyebrow mb-3 block">Join Raja Construction</span>
      <h1 className="font-display text-4xl mb-10">Create an Account</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Full Name" placeholder="Jane Whitfield" required error={errors.name?.message} {...register('name')} />
        <FormField label="Email" type="email" placeholder="you@example.com" required error={errors.email?.message} {...register('email')} />
        <FormField label="Password" type="password" placeholder="••••••••" required error={errors.password?.message} {...register('password')} />
        <FormField
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        {error && <p className="field-error !mt-0">{error}</p>}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-60">
          {status === 'loading' ? 'Creating Account…' : 'Create Account'}
        </button>
      </form>

      <p className="text-[13px] text-stone mt-8">
        Already have an account?{' '}
        <Link href="/login" className="text-gold-deep underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
