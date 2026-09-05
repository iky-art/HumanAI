import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import NotificationBell from './NotificationBell';
import BroadcastBanner from './BroadcastBanner';
import LanguageSwitcher from './LanguageSwitcher';

export default function AppShell() {
  const { profile, logout } = useAuth();
  const { t } = useLanguage();
  const [drawerOpen, setDrawerOpen] = useState(false);
  if (!profile) return null; // ProtectedRoute already guarantees this, just satisfies TS

  const canOperate = profile.role === 'operator' || profile.role === 'admin' || profile.role === 'founder';
  const canAdmin = profile.role === 'admin' || profile.role === 'founder';
  const isFounder = profile.role === 'founder';

  const links = (
    <>
      <TopLink to="/chat" onNavigate={() => setDrawerOpen(false)}>{t('nav.chat')}</TopLink>
      <TopLink to="/history" onNavigate={() => setDrawerOpen(false)}>{t('nav.history')}</TopLink>
      <TopLink to="/profile" onNavigate={() => setDrawerOpen(false)}>{t('nav.profile')}</TopLink>
      <TopLink to="/pricing" onNavigate={() => setDrawerOpen(false)}>{t('nav.pricing')}</TopLink>
      <TopLink to="/about" onNavigate={() => setDrawerOpen(false)}>{t('nav.about')}</TopLink>
      <TopLink to="/rules" onNavigate={() => setDrawerOpen(false)}>{t('nav.rules')}</TopLink>
      <TopLink to="/settings" onNavigate={() => setDrawerOpen(false)}>{t('nav.settings')}</TopLink>
      {canOperate && <TopLink to="/operator" onNavigate={() => setDrawerOpen(false)}>Operator Panel</TopLink>}
      {canAdmin && <TopLink to="/admin" onNavigate={() => setDrawerOpen(false)}>Admin Panel</TopLink>}
      {isFounder && <TopLink to="/founder" onNavigate={() => setDrawerOpen(false)}>Founder Panel</TopLink>}
    </>
  );

  return (
    <div className="min-h-dvh bg-ink text-ash-100">
      <header className="flex items-center justify-between border-b border-ink-border px-6 py-4 md:px-12">
        <NavLink to="/chat" className="font-display text-lg font-medium">
          HumanAI
        </NavLink>

        {/* Desktop: inline links */}
        <nav className="hidden items-center gap-5 text-sm md:flex">{links}</nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <NotificationBell />
          {/* Mobile: hamburger opens a drawer */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Buka menu"
            className="flex h-9 w-9 items-center justify-center rounded-sm text-ash-300 hover:bg-ink-raised md:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          <button type="button" onClick={logout} className="hidden text-sm text-ash-500 hover:text-danger md:block">
            {t('nav.logout')}
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDrawerOpen(false)} />
          <div className="relative flex w-72 flex-col gap-1 bg-ink-card p-5">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-display text-lg">HumanAI</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Tutup menu" className="text-ash-500">
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3 text-sm">{links}</div>
            <button
              type="button"
              onClick={logout}
              className="mt-4 border-t border-ink-border pt-4 text-left text-sm text-danger"
            >
              {t('nav.logout')}
            </button>
          </div>
        </div>
      )}

      <BroadcastBanner />
      <Outlet />
    </div>
  );
}

function TopLink({ to, children, onNavigate }: { to: string; children: React.ReactNode; onNavigate?: () => void }) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) => (isActive ? 'text-ash-100' : 'text-ash-500 hover:text-ash-300')}
    >
      {children}
    </NavLink>
  );
}
