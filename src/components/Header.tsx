import React from 'react';
import { Logo } from './Logo';
import { Shield, Sparkles, User, LogIn, Menu, X } from 'lucide-react';
import { Investor } from '../types';

interface HeaderProps {
  activePage: 'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin';
  setActivePage: (page: 'home' | 'about' | 'vision' | 'contact' | 'dashboard' | 'admin') => void;
  onOpenLogin: () => void;
  onOpenAdminLogin: () => void;
  onOpenRegister: () => void;
  onOpenPromptFormula: () => void;
  isAdminLoggedIn: boolean;
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
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

        {/* Zone 3: Actions - Admin Icon Button + Register / Member Profile Button */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          
          {/* The ADMIN DASHBOARD Icon Button */}
          <button
            onClick={onOpenAdminLogin}
            title={isAdminLoggedIn ? 'Open Admin Control Room' : 'Access Admin Dashboard (Password Protected)'}
            className={`relative p-2.5 rounded-xl border transition shadow-md flex items-center justify-center ${
              isAdminLoggedIn || activePage === 'admin'
                ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/50'
                : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300 hover:text-white hover:border-emerald-500'
            }`}
            aria-label="Admin Dashboard Access Icon"
          >
            <Shield className="w-5 h-5 text-current" />
            <span className="sr-only">Admin Dashboard</span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-black" />
          </button>

          {/* Member Login Button */}
          <button
            type="button"
            onClick={onOpenLogin}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-xl transition cursor-pointer whitespace-nowrap shrink-0 ${
              activePage === 'dashboard'
                ? 'bg-neutral-800 text-emerald-400 border border-emerald-500/60 shadow-md'
                : 'text-neutral-200 hover:text-white bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-750 hover:border-emerald-500 shadow-sm'
            }`}
            title="Member Login & Dashboard Access"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Login</span>
          </button>

          {/* Register Action Button */}
          {activePage !== 'dashboard' ? (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition shadow-lg shadow-emerald-950/60 whitespace-nowrap shrink-0"
            >
              <span>Register</span>
            </button>
          ) : (
            <button
              onClick={onOpenRegister}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-xl transition"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[120px]">{currentInvestor.fullName.split(' ')[0]}</span>
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-400 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              setActivePage('dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold text-emerald-400 hover:bg-neutral-900"
          >
            Investor Dashboard
          </button>
          <div className="pt-2 border-t border-neutral-800 flex gap-2">
            <button
              onClick={() => {
                onOpenLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold bg-neutral-900 border border-neutral-750 hover:border-emerald-500 text-emerald-400 rounded-lg text-center flex items-center justify-center gap-1.5"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
            <button
              onClick={() => {
                onOpenRegister();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-bold bg-emerald-600 text-white rounded-lg text-center"
            >
              Register
            </button>
            <button
              onClick={() => {
                onOpenAdminLogin();
                setMobileMenuOpen(false);
              }}
              className="flex-1 py-2 text-xs font-semibold bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg text-center hover:border-emerald-500"
            >
              Admin Access
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
