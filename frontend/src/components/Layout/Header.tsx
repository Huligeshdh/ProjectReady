import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, ChevronDown, Cpu, ShieldCheck, Menu, LogOut, Settings, Sparkles } from 'lucide-react';
import { ThemeToggle } from '../UI/ThemeToggle';

interface HeaderProps {
  onMenuToggle?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, onLogout }) => {
  const navigate = useNavigate();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-4 md:px-6 flex items-center justify-between sticky top-0 z-20 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Toggle */}
        <button
          onClick={onMenuToggle}
          type="button"
          className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
          aria-label="Toggle navigation drawer"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Current Project Context */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/40 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Active:</span>
          <span className="font-bold text-brand-600 dark:text-brand-400">AI Retinopathy Diagnosis</span>
        </div>

        {/* AI Router Active Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="font-semibold">AI Router Active</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Provider Indicator */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100 dark:bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
          <Cpu className="w-3.5 h-3.5 text-brand-500 dark:text-brand-400" />
          <span>Provider: <strong className="text-slate-900 dark:text-slate-100 font-semibold">Gemini / OpenAI / Ollama</strong></span>
        </div>

        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Notifications Icon */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Notifications"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
        </button>

        <div className="h-5 w-px bg-slate-200 dark:bg-slate-800" />

        {/* User Profile & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            type="button"
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-extrabold text-xs text-white shadow-md shadow-brand-500/20">
              AR
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">Alex Rivera</p>
              <p className="text-[10px] text-brand-600 dark:text-brand-400 font-medium leading-tight">Senior CSE Student</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          </button>

          {/* Profile Dropdown Menu */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 space-y-1 z-50 backdrop-blur-2xl animate-fadeIn">
              <button
                onClick={() => { navigate('/profile'); setProfileDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              >
                <User className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                <span>Student Profile</span>
              </button>
              <button
                onClick={() => { navigate('/settings'); setProfileDropdownOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition"
              >
                <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>AI Settings</span>
              </button>
              <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
