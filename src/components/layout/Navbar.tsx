'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';

const baseLinks = [
  { href: '/', label: 'Home' },
  { href: '/properties', label: 'Properties' },
  { href: '/locations', label: 'Locations' },
  { href: '/shortlist', label: 'Shortlist' },
];

function UserAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-white text-[11px] font-semibold flex items-center justify-center select-none shrink-0">
      {initials}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const shortlistCount = useAppSelector((s) => s.shortlist.ids.length);
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const isOwner = user?.role === 'owner';

  const getLinkClass = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return `text-[12px] uppercase tracking-[0.2em] transition-colors ${
      isActive ? 'text-ruby font-semibold' : 'text-charcoal/80 hover:text-emerald-800'
    }`;
  };

  const handleLogout = () => {
    dispatch(logout());
    setOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-ivory/95 backdrop-blur border-b border-emerald-900/10">
      <div className="container-xl flex items-center justify-between h-20">

        {/* ── Brand ── */}
        <Link href="/" className="font-display text-2xl tracking-wide flex items-center gap-1.5 shrink-0">
          <span className="text-emerald-800 font-bold">RAJA</span>
          <span className="text-ruby italic font-serif">Construction</span>
        </Link>

        {/* ── Desktop Nav Links ── */}
        <nav className="hidden md:flex items-center gap-8">
          {baseLinks.map((l) => (
            <Link key={l.href} href={l.href} className={getLinkClass(l.href)}>
              {l.label === 'Shortlist' ? (
                <span className="inline-flex items-center gap-1.5">
                  Shortlist
                  {shortlistCount > 0 && (
                    <span className="bg-ruby text-white text-[10px] px-1.5 py-0.5 rounded-full font-sans">
                      {shortlistCount}
                    </span>
                  )}
                </span>
              ) : (
                l.label
              )}
            </Link>
          ))}
        </nav>

        {/* ── Desktop Right Actions ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* My Account button */}
              <Link
                href={isOwner ? '/owner/dashboard' : '/account'}
                id="navbar-my-account-link"
                className="flex items-center gap-2 py-2 px-4 rounded-lg border border-emerald-800/20 hover:bg-emerald-50 hover:border-emerald-800/40 transition-colors"
              >
                <UserAvatar name={user.name} />
                <div className="leading-tight">
                  <p className="text-[11px] uppercase tracking-[0.15em] text-charcoal font-semibold">
                    {user.name.split(' ')[0]}
                  </p>
                  <p className="text-[10px] text-stone">
                    {isOwner ? 'Owner' : 'My Account'}
                  </p>
                </div>
              </Link>

              {/* Sign Out button */}
              <button
                onClick={handleLogout}
                id="navbar-signout-btn"
                className="flex items-center gap-1.5 text-[12px] uppercase tracking-[0.15em] text-ruby font-medium hover:text-ruby-deep transition-colors border border-ruby/20 hover:border-ruby/40 hover:bg-ruby/5 px-4 py-2 rounded-lg"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              id="navbar-signin-btn"
              className="btn-primary !px-6 !py-2.5 !text-[11px]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* ── Mobile Hamburger ── */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`w-6 h-px bg-charcoal transition-all duration-200 ${open ? 'rotate-45 translate-y-[7px]' : ''}`} />
          <span className={`w-6 h-px bg-charcoal transition-all duration-200 ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-px bg-charcoal transition-all duration-200 ${open ? '-rotate-45 -translate-y-[7px]' : ''}`} />
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {open && (
        <div className="md:hidden border-t border-charcoal/10 bg-ivory">
          <div className="container-xl py-6 flex flex-col gap-5">

            {/* Nav Links */}
            {baseLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={getLinkClass(l.href)}
                onClick={() => setOpen(false)}
              >
                {l.label === 'Shortlist' ? `Shortlist (${shortlistCount})` : l.label}
              </Link>
            ))}

            <div className="h-px bg-charcoal/10" />

            {/* Auth section */}
            {user ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 py-2">
                  <UserAvatar name={user.name} />
                  <div>
                    <p className="font-semibold text-sm text-charcoal">{user.name}</p>
                    <p className="text-[11px] text-stone">{user.email}</p>
                  </div>
                </div>

                {/* My Account */}
                <Link
                  href={isOwner ? '/owner/dashboard' : '/account'}
                  onClick={() => setOpen(false)}
                  id="mobile-my-account-link"
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-emerald-800 font-semibold"
                >
                  <span>👤</span> My Account
                </Link>

                {/* Sign Out */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-ruby font-semibold text-left"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="btn-primary !py-3 text-center"
              >
                Sign In / Sign Up
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
