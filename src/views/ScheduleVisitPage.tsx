'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { fetchProperties } from '../store/slices/propertiesSlice';
import { resetInquiryStatus, submitInquiry } from '../store/slices/inquirySlice';
import { FormField, TextAreaField } from '../components/forms/FormField';
import { formatPrice } from '../utils/format';

const schema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  preferredDate: z.string().min(1, 'Please select a date'),
  preferredTime: z.string().min(1, 'Please select a time'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const steps = ['Your Details', 'Preferred Time', 'Review & Confirm'];

export function ScheduleVisitPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { items, status: propStatus } = useAppSelector((s) => s.properties);
  const { status, error, lastInquiry } = useAppSelector((s) => s.inquiry);
  const user = useAppSelector((s) => s.auth.user);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (propStatus === 'idle') dispatch(fetchProperties());
  }, [propStatus, dispatch]);

  useEffect(() => {
    dispatch(resetInquiryStatus());
  }, [dispatch]);

  const property = items.find((p) => p.id === id);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    shouldUnregister: false,
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', phone: '', preferredDate: '', preferredTime: '', message: '' },
  });

  const stepFields: (keyof FormValues)[][] = [
    ['name', 'email', 'phone'],
    ['preferredDate', 'preferredTime'],
    [],
  ];

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (valid) setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const onInvalid = (formErrors: typeof errors) => {
    if (formErrors.name || formErrors.email || formErrors.phone) {
      setStep(0);
    } else if (formErrors.preferredDate || formErrors.preferredTime) {
      setStep(1);
    }
  };

  const onSubmit = (values: FormValues) => {
    if (!property) return;
    dispatch(
      submitInquiry({
        propertyId: property.id,
        propertyTitle: property.title,
        ...values,
      }),
    );
  };

  if (propStatus === 'loading' || propStatus === 'idle') {
    return <div className="container-xl py-32 text-center text-stone">Loading…</div>;
  }

  if (!property) {
    return (
      <div className="container-xl py-32 text-center">
        <p className="font-display text-2xl mb-4">Property not found</p>
        <Link href="/properties" className="btn-outline">
          Back to Properties
        </Link>
      </div>
    );
  }

  if (status === 'succeeded' && lastInquiry) {
    return (
      <div className="container-xl py-32 max-w-lg text-center">
        <div className="w-14 h-14 rounded-full border border-emerald-700 bg-emerald-50 flex items-center justify-center mx-auto mb-8">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#047857" strokeWidth="2">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="label-eyebrow mb-3 block">Request Received</span>
        <h1 className="font-display text-3xl mb-4 text-emerald-950">Your private viewing is being arranged</h1>
        <p className="text-stone text-[14px] leading-relaxed mb-10">
          An advisor will confirm your visit to <strong className="text-emerald-950">{property.title}</strong> on{' '}
          {lastInquiry.preferredDate} at {lastInquiry.preferredTime} within one business day, by email at {lastInquiry.email}.
        </p>
        <Link href="/properties" className="btn-primary">
          Continue Browsing
        </Link>
      </div>
    );
  }

  return (
    <div className="container-xl py-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
      <div className="lg:col-span-2">
        <span className="label-eyebrow mb-3 block">Schedule a Private Viewing</span>
        <h1 className="font-display text-3xl mb-10 text-emerald-950">{property.title}</h1>

        <div className="flex items-center gap-3 mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold border ${i <= step ? 'bg-emerald-700 border-emerald-700 text-ivory' : 'border-emerald-900/20 text-stone'
                  }`}
              >
                {i + 1}
              </div>
              <span className={`text-[12px] uppercase tracking-[0.15em] ${i === step ? 'text-ruby font-semibold' : 'text-stone'}`}>{s}</span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-charcoal/15 ml-2" />}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
          <div className={step === 0 ? 'space-y-6' : 'hidden'}>
            <FormField label="Full Name" placeholder="Jane Whitfield" required error={errors.name?.message} {...register('name')} />
            <FormField label="Email" type="email" placeholder="you@example.com" required error={errors.email?.message} {...register('email')} />
            <FormField label="Phone" type="tel" placeholder="+1 212 555 0148" required error={errors.phone?.message} {...register('phone')} />
            <button type="button" onClick={goNext} className="btn-primary w-full">
              Continue
            </button>
          </div>

          <div className={step === 1 ? 'space-y-6' : 'hidden'}>
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Preferred Date" type="date" required error={errors.preferredDate?.message} {...register('preferredDate')} />
              <FormField label="Preferred Time" type="time" required error={errors.preferredTime?.message} {...register('preferredTime')} />
            </div>
            <TextAreaField as="textarea" label="Message (optional)" placeholder="Anything your advisor should know…" {...register('message')} />
            <div className="flex gap-3">
              <button type="button" onClick={goBack} className="btn-outline w-full">
                Back
              </button>
              <button type="button" onClick={goNext} className="btn-primary w-full">
                Review
              </button>
            </div>
          </div>

          <div className={step === 2 ? 'space-y-6' : 'hidden'}>
            <div className="border border-charcoal/10 p-6 space-y-3 text-[14px]">
              <div className="flex justify-between">
                <span className="text-stone">Name</span>
                <span>{getValues('name')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Email</span>
                <span>{getValues('email')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Phone</span>
                <span>{getValues('phone')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone">Date &amp; Time</span>
                <span>
                  {getValues('preferredDate')} at {getValues('preferredTime')}
                </span>
              </div>
              {getValues('message') && (
                <div className="flex justify-between border-t border-charcoal/10 pt-3">
                  <span className="text-stone">Message</span>
                  <span className="max-w-[200px] text-right truncate">{getValues('message')}</span>
                </div>
              )}
            </div>

            {error && <p className="field-error">{error}</p>}

            <div className="flex gap-3">
              <button type="button" onClick={goBack} className="btn-outline w-full">
                Back
              </button>
              <button type="submit" disabled={status === 'loading'} className="btn-primary w-full disabled:opacity-60">
                {status === 'loading' ? 'Submitting…' : 'Confirm Request'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <aside className="border border-charcoal/10 p-6 h-fit">
        <img src={property.images[0]} alt={property.title} className="w-full h-44 object-cover mb-5" />
        <h3 className="font-display text-lg mb-1">{property.title}</h3>
        <p className="text-[13px] text-stone mb-4">
          {property.location}, {property.city}
        </p>
        <div className="font-display text-xl border-t border-charcoal/10 pt-4">
          {formatPrice(property.price, property.currency)}
          {property.status === 'For Rent' && <span className="text-[13px] text-stone"> / mo</span>}
        </div>
      </aside>
    </div>
  );
}
