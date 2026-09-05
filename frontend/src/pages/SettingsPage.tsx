import React, { useState } from 'react';
import { Settings, Cpu, Check, Key, Sun, Moon, Laptop, Palette } from 'lucide-react';
import { useTheme, ThemeMode } from '../context/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { mode, setMode } = useTheme();
  const [defaultProvider, setDefaultProvider] = useState('gemini');
  const [codeProvider, setCodeProvider] = useState('openai');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5" /> Global System Settings
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Appearance & Router Settings</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Configure application theme preference, AI providers, and automated fallback ordering.
        </p>
      </div>

      {/* Appearance Section */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Palette className="w-4 h-4 text-brand-500" /> Appearance & Day/Night Mode
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Choose your preferred visual theme across ProjectReady.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setMode('system')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition text-left ${
              mode === 'system'
                ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-slate-200/60 dark:bg-slate-800">
              <Laptop className="w-5 h-5 text-cyan-500" />
            </div>
            <div className="text-center">
              <span className="font-semibold text-xs block">System</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Sync with OS theme</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('light')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition text-left ${
              mode === 'light'
                ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-amber-500/10">
              <Sun className="w-5 h-5 text-amber-500" />
            </div>
            <div className="text-center">
              <span className="font-semibold text-xs block">Light</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Clean light appearance</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setMode('dark')}
            className={`p-4 rounded-xl border flex flex-col items-center gap-3 transition text-left ${
              mode === 'dark'
                ? 'bg-brand-500/10 border-brand-500 ring-2 ring-brand-500/20 text-brand-600 dark:text-brand-400'
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="p-2.5 rounded-lg bg-indigo-500/10">
              <Moon className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-center">
              <span className="font-semibold text-xs block">Dark</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">Sleek dark mode</span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-brand-500" /> Task Provider Matrix
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Idea Generation & Blueprint:</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Structured reasoning & idea synthesis</p>
            </div>
            <select
              value={defaultProvider}
              onChange={(e) => setDefaultProvider(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI API (GPT-4o)</option>
              <option value="nvidia">NVIDIA Llama 3.1 70B</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">ZIP Code Review & Vulnerability Scanner:</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Code auditing & security pattern analysis</p>
            </div>
            <select
              value={codeProvider}
              onChange={(e) => setCodeProvider(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              <option value="openai">OpenAI API (GPT-4o)</option>
              <option value="gemini">Google Gemini API</option>
              <option value="nvidia">NVIDIA Llama 3.1 70B</option>
              <option value="ollama">Ollama (Local Privacy)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs transition shadow-lg shadow-brand-500/20 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            {saved ? <Check className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            <span>{saved ? 'Settings Saved' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

