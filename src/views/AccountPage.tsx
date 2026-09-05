'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { fetchProperties } from '../store/slices/propertiesSlice';

// ─── Avatar ───────────────────────────────────────────────────────────────────

function UserAvatar({ name, size = 'lg' }: { name: string; size?: 'sm' | 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-white font-semibold select-none ${
        size === 'lg' ? 'w-20 h-20 text-2xl' : 'w-9 h-9 text-sm'
      }`}
    >
      {initials}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  value,
  label,
  href,
  color = 'emerald',
}: {
  icon: string;
  value: number | string;
  label: string;
  href?: string;
  color?: 'emerald' | 'ruby' | 'gold';
}) {
  const colorMap = {
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    ruby: 'bg-ruby/5 text-ruby border-ruby/10',
    gold: 'bg-amber-50 text-amber-700 border-amber-100',
  };

  const content = (
    <div
      className={`group border rounded-xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md ${colorMap[color]} ${
        href ? 'cursor-pointer' : ''
      }`}
    >
      <span className="text-2xl mb-3 block">{icon}</span>
      <p className="font-display text-3xl font-normal mb-1">{value}</p>
      <p className="text-[12px] uppercase tracking-[0.15em] font-medium opacity-70">{label}</p>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="font-display text-xl text-charcoal">{title}</h2>
      {action}
    </div>
  );
}

// ─── Quick Action Card ────────────────────────────────────────────────────────

function QuickAction({
  icon,
  label,
  description,
  href,
}: {
  icon: string;
  label: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 p-5 border border-stone/10 rounded-xl hover:border-emerald-800/30 hover:bg-emerald-50/50 transition-all group"
    >
      <span className="text-2xl mt-0.5">{icon}</span>
      <div>
        <p className="font-semibold text-sm text-charcoal group-hover:text-emerald-800 transition-colors">
          {label}
        </p>
        <p className="text-[13px] text-stone mt-0.5">{description}</p>
      </div>
      <span className="ml-auto text-stone/40 group-hover:text-emerald-700 transition-colors mt-0.5">→</span>
    </Link>
  );
}

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({
  user,
  onClose,
}: {
  user: { name: string; email: string };
  onClose: () => void;
}) {
  const [name, setName] = useState(user.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-2xl">Edit Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone/10 text-stone transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="field-label">Full Name</label>
            <input
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="field-label">Email Address</label>
            <input
              className="field-input opacity-60 cursor-not-allowed"
              value={user.email}
              disabled
              title="Email cannot be changed"
            />
            <p className="text-[12px] text-stone mt-1.5">Email address cannot be changed.</p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 border border-stone/20 text-stone text-[12px] uppercase tracking-[0.15em] hover:border-stone/40 transition-colors rounded"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 btn-primary !py-3"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function AccountPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const shortlistCount = useAppSelector((s) => s.shortlist.ids.length);
  const shortlistIds = useAppSelector((s) => s.shortlist.ids);
  const { items, status } = useAppSelector((s) => s.properties);
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'shortlist' | 'settings'>('overview');

  useEffect(() => {
    if (!user) {
      router.push('/login?from=' + encodeURIComponent('/account'));
    }
  }, [user, router]);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProperties());
  }, [status, dispatch]);

  if (!user) return null;

  const shortlisted = items.filter((p) => shortlistIds.includes(p.id)).slice(0, 3);
  const memberSince = new Date().getFullYear();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} />
      )}

      <div className="min-h-screen bg-ivory">
        {/* Profile Header Banner */}
        <div className="bg-gradient-to-r from-charcoal via-charcoal-soft to-emerald-dark pt-16 pb-24">
          <div className="container-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative">
                <UserAvatar name={user.name} size="lg" />
                <button
                  onClick={() => setShowEditModal(true)}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-[13px] hover:scale-110 transition-transform"
                  title="Edit profile"
                >
                  ✏️
                </button>
              </div>
              <div>
                <p className="text-emerald-bright text-[11px] uppercase tracking-[0.3em] mb-1">
                  Client Account
                </p>
                <h1 className="font-display text-3xl md:text-4xl text-ivory mb-1">
                  {user.name}
                </h1>
                <p className="text-ivory/50 text-sm">{user.email}</p>
              </div>
              <div className="sm:ml-auto flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="btn-outline-light !px-5 !py-2.5 !text-[11px] !rounded"
                >
                  ✏️ Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 bg-ruby/20 hover:bg-ruby/30 text-ruby-bright border border-ruby/20 text-[11px] uppercase tracking-[0.15em] font-medium rounded transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-stone/10 sticky top-20 z-30 -mt-1">
          <div className="container-xl">
            <div className="flex gap-0">
              {([
                { key: 'overview', label: 'Overview', icon: '📊' },
                { key: 'shortlist', label: `Shortlist (${shortlistCount})`, icon: '❤️' },
                { key: 'settings', label: 'Settings', icon: '⚙️' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  id={`account-tab-${tab.key}`}
                  className={`flex items-center gap-2 px-6 py-4 text-[12px] uppercase tracking-[0.15em] font-semibold border-b-2 transition-all ${
                    activeTab === tab.key
                      ? 'border-ruby text-charcoal'
                      : 'border-transparent text-stone hover:text-charcoal'
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="container-xl py-10">
          {/* ── Overview Tab ── */}
          {activeTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-200">
              {/* Stats */}
              <div>
                <SectionHeader title="Your Activity" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    icon="❤️"
                    value={shortlistCount}
                    label="Saved Properties"
                    href="/shortlist"
                    color="ruby"
                  />
                  <StatCard
                    icon="🏡"
                    value={items.length}
                    label="Available Listings"
                    href="/properties"
                    color="emerald"
                  />
                  <StatCard
                    icon="📅"
                    value="0"
                    label="Visits Scheduled"
                    color="gold"
                  />
                  <StatCard
                    icon="⭐"
                    value={memberSince}
                    label="Member Since"
                    color="emerald"
                  />
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <SectionHeader title="Quick Actions" />
                <div className="grid sm:grid-cols-2 gap-3">
                  <QuickAction
                    icon="🏘️"
                    label="Browse Properties"
                    description="Explore luxury listings across Erode"
                    href="/properties"
                  />
                  <QuickAction
                    icon="❤️"
                    label="View Shortlist"
                    description={`You have ${shortlistCount} saved propert${shortlistCount === 1 ? 'y' : 'ies'}`}
                    href="/shortlist"
                  />
                  <QuickAction
                    icon="📍"
                    label="Explore Locations"
                    description="Discover premium areas in Erode"
                    href="/locations"
                  />
                  <QuickAction
                    icon="📞"
                    label="Contact Us"
                    description="Speak with a Raja Construction advisor"
                    href="/"
                  />
                </div>
              </div>

              {/* Shortlisted preview */}
              {shortlisted.length > 0 && (
                <div>
                  <SectionHeader
                    title="Recently Saved"
                    action={
                      <Link
                        href="/shortlist"
                        className="text-[12px] uppercase tracking-[0.15em] text-ruby hover:underline font-medium"
                      >
                        View all →
                      </Link>
                    }
                  />
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {shortlisted.map((p) => (
                      <Link
                        key={p.id}
                        href={`/properties/${p.id}`}
                        className="group flex gap-4 p-4 border border-stone/10 rounded-xl hover:border-emerald-800/30 hover:shadow-md transition-all"
                      >
                        <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-emerald-100 to-emerald-200 flex-shrink-0 overflow-hidden">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl">🏡</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-charcoal truncate group-hover:text-emerald-800 transition-colors">
                            {p.title}
                          </p>
                          <p className="text-stone text-[12px] mt-0.5">{p.location}</p>
                          <p className="text-emerald-700 font-semibold text-sm mt-2">
                            {p.currency} {p.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Shortlist Tab ── */}
          {activeTab === 'shortlist' && (
            <div className="animate-in fade-in duration-200">
              <SectionHeader
                title="Your Saved Properties"
                action={
                  shortlistCount > 0 ? (
                    <Link
                      href="/shortlist"
                      className="btn-primary !px-5 !py-2.5 !text-[11px]"
                    >
                      Manage Shortlist
                    </Link>
                  ) : null
                }
              />
              {shortlistCount === 0 ? (
                <div className="text-center py-24 border border-dashed border-stone/20 rounded-2xl">
                  <span className="text-5xl mb-4 block">❤️</span>
                  <p className="font-display text-2xl mb-3">Your shortlist is empty</p>
                  <p className="text-stone text-sm mb-8">
                    Save properties you love to compare them later.
                  </p>
                  <Link href="/properties" className="btn-primary">
                    Browse Properties
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {items
                    .filter((p) => shortlistIds.includes(p.id))
                    .map((p) => (
                      <Link
                        key={p.id}
                        href={`/properties/${p.id}`}
                        className="group border border-stone/10 rounded-xl overflow-hidden hover:shadow-lg hover:border-emerald-800/30 transition-all"
                      >
                        <div className="h-44 bg-gradient-to-br from-emerald-100 to-emerald-200 overflow-hidden">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-4xl">🏡</div>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-sm truncate">{p.title}</p>
                          <p className="text-stone text-[12px] mt-0.5">{p.location}</p>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-emerald-700 font-semibold">
                              {p.currency} {p.price.toLocaleString()}
                            </p>
                            <span className="text-[11px] text-stone bg-stone/10 px-2 py-1 rounded">
                              {p.type}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* ── Settings Tab ── */}
          {activeTab === 'settings' && (
            <div className="max-w-lg space-y-8 animate-in fade-in duration-200">
              <div>
                <SectionHeader title="Account Settings" />
                <div className="space-y-4">
                  {/* Profile Info */}
                  <div className="border border-stone/10 rounded-xl p-6 space-y-4 bg-white">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone">
                      Profile Information
                    </h3>
                    <div className="flex items-center gap-4">
                      <UserAvatar name={user.name} size="sm" />
                      <div>
                        <p className="font-semibold text-sm">{user.name}</p>
                        <p className="text-stone text-[13px]">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="btn-primary !px-5 !py-2.5 !text-[11px] w-full"
                    >
                      Edit Profile
                    </button>
                  </div>

                  {/* Preferences */}
                  <div className="border border-stone/10 rounded-xl p-6 bg-white space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-stone">
                      Preferences
                    </h3>
                    {[
                      { label: 'Email notifications for new listings', checked: true },
                      { label: 'Price drop alerts for saved properties', checked: true },
                      { label: 'Weekly property digest', checked: false },
                    ].map((pref) => (
                      <label
                        key={pref.label}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <span className="text-sm text-charcoal">{pref.label}</span>
                        <div
                          className={`relative w-10 h-5 rounded-full transition-colors ${
                            pref.checked ? 'bg-emerald-700' : 'bg-stone/20'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                              pref.checked ? 'translate-x-5' : 'translate-x-0.5'
                            }`}
                          />
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Danger Zone */}
                  <div className="border border-ruby/20 rounded-xl p-6 bg-ruby/5 space-y-4">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.15em] text-ruby">
                      Danger Zone
                    </h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-charcoal">Sign out of your account</p>
                        <p className="text-[12px] text-stone mt-0.5">
                          You'll need to sign in again to access your account.
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        id="account-signout-btn"
                        className="btn-red !px-5 !py-2.5 !text-[11px] flex-shrink-0"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
