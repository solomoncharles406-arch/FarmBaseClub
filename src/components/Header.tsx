import React from 'react';
import { Logo } from './Logo';
import { Sparkles, User, LogIn, LogOut, Menu, X } from 'lucide-react';
import { Investor } from '../types';

interface HeaderProps {
  activePage: 'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin';
  setActivePage: (page: 'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin') => void;
  onOpenLogin: () => void;
  onOpenAdminLogin?: () => void;
  onOpenRegister: () => void;
  onOpenPromptFormula: () => void;
  isAdminLoggedIn: boolean;
  isMemberLoggedIn: boolean;
  onMemberLogout?: () => void;
  currentInvestor: Investor;
  systemNotice?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onOpenLogin,
  onOpenAdminLogin,
  onOpenRegister,
  onOpenPromptFormula,
  isAdminLoggedIn,
  isMemberLoggedIn,
  onMemberLogout,
  currentInvestor,
  systemNotice,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home' as const, label: 'Home' },
    { id: 'about' as const, label: 'About Us' },
    { id: 'vision' as const, label: 'Vision 2030' },
    { id: 'contact' as const, label: 'Contact Desk' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-md border-b border-neutral-800">
      {systemNotice && (
        <div className="bg-gradient-to-r from-[#06180c] via-[#09150d] to-black border-b border-emerald-900/60 px-4 py-1.5 text-xs text-emerald-200 flex items-center justify-center gap-2.5 shadow-inner">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-600 text-white shrink-0">
            OFFICIAL BULLETIN
          </span>
          <span className="truncate max-w-4xl font-medium">{systemNotice}</span>
        </div>
      )}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Zone 1: Brand Wordmark & 3D Logo */}
        <div
          onClick={() => setActivePage('home')}
          className="cursor-pointer transition hover:opacity-95 shrink-0"
        >
          <Logo size="md" />
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold tracking-wide">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => setActivePage(link.id)}
              className={`transition-colors whitespace-nowrap shrink-0 relative py-1 ${
                activePage === link.id
                  ? 'text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
              {activePage === link.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-500" />
              )}
            </button>
          ))}
        </nav>

        {/* Zone 3: Actions - Member Login & Register / Member Profile Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Member Login / Profile & Logout */}
          {!isMemberLoggedIn ? (
            <>
              <button
                type="button"
                onClick={onOpenLogin}
                className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-bold rounded-lg sm:rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-750 hover:border-emerald-500 shadow-sm"
                title="Member Portal Login (Username & Password Required)"
              >
                <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span>Login</span>
              </button>

              <button
                onClick={onOpenRegister}
                className="flex items-center justify-center px-2.5 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg sm:rounded-xl transition shadow-lg shadow-emerald-950/60 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Register</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setActivePage('dashboard')}
                className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl transition cursor-pointer ${
                  activePage === 'dashboard'
                    ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/60 shadow-md'
                    : 'text-neutral-200 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700'
                }`}
                title="Open Member Dashboard"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentInvestor.fullName.split(' ')[0] || 'Dashboard'}</span>
              </button>

              {onMemberLogout && (
                <button
                  type="button"
                  onClick={onMemberLogout}
                  className="p-1.5 sm:p-2 text-neutral-400 hover:text-red-400 hover:bg-neutral-900 border border-neutral-800 hover:border-red-500/50 rounded-lg sm:rounded-xl transition cursor-pointer"
                  title="Log out of Member Account"
                >
                  <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1 sm:p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950 border-b border-neutral-800 px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-semibold transition ${
                activePage === link.id
                  ? 'bg-neutral-900 text-white border-l-2 border-emerald-500'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              if (isMemberLoggedIn) {
                setActivePage('dashboard');
              } else {
                onOpenLogin();
              }
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-neutral-900"
          >
            {isMemberLoggedIn ? 'Member Dashboard' : 'Member Dashboard (Login Required)'}
          </button>
          <div className="pt-2 border-t border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {!isMemberLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 text-xs font-bold bg-neutral-900 border border-neutral-750 hover:border-emerald-500 text-emerald-400 rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onOpenRegister();
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-center cursor-pointer shadow-sm"
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onMemberLogout?.();
                    setMobileMenuOpen(false);
                  }}
                  className="col-span-2 py-2.5 px-3 text-xs font-bold bg-neutral-900 border border-red-900/50 hover:bg-red-950 text-red-300 rounded-xl text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  <span>Log Out ({currentInvestor.fullName.split(' ')[0]})</span>
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
