import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { useTheme, ThemeMode } from '../../context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, resolvedTheme, setMode, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = () => {
    if (mode === 'system') {
      return <Laptop className="w-4 h-4 text-cyan-400" />;
    }
    return resolvedTheme === 'dark' ? (
      <Moon className="w-4 h-4 text-indigo-400 transition-transform duration-300 hover:-rotate-12" />
    ) : (
      <Sun className="w-4 h-4 text-amber-500 transition-transform duration-300 hover:rotate-45" />
    );
  };

  const getLabel = () => {
    if (mode === 'system') return `System (${resolvedTheme === 'dark' ? 'Dark' : 'Light'})`;
    return mode === 'dark' ? 'Dark mode' : 'Light mode';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        onContextMenu={(e) => {
          e.preventDefault();
          toggleTheme();
        }}
        type="button"
        className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 flex items-center justify-center gap-1.5"
        title={`Theme: ${getLabel()} (Click to select, Right-click to quick cycle)`}
        aria-label={`Current theme mode: ${getLabel()}. Click to change.`}
      >
        {getIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-2xl z-50 animate-fadeIn space-y-1">
          <button
            onClick={() => {
              setMode('light');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
              mode === 'light'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-amber-500" /> Light
            </span>
            {mode === 'light' && <Check className="w-3.5 h-3.5 text-brand-500" />}
          </button>

          <button
            onClick={() => {
              setMode('dark');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
              mode === 'dark'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5 text-indigo-400" /> Dark
            </span>
            {mode === 'dark' && <Check className="w-3.5 h-3.5 text-brand-500" />}
          </button>

          <button
            onClick={() => {
              setMode('system');
              setIsOpen(false);
            }}
            className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition ${
              mode === 'system'
                ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
            }`}
          >
            <span className="flex items-center gap-2">
              <Laptop className="w-3.5 h-3.5 text-cyan-400" /> System
            </span>
            {mode === 'system' && <Check className="w-3.5 h-3.5 text-brand-500" />}
          </button>
        </div>
      )}
    </div>
  );
};

