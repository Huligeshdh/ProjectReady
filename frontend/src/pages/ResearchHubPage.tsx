import React, { useState, useEffect } from 'react';
import { Search, BookOpen, GitFork, Youtube, Database, ExternalLink, Star } from 'lucide-react';
import { apiService } from '../services/api';
import { ResearchPaper, Repository, LearningResource, Dataset } from '../types';

export const ResearchHubPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'papers' | 'repos' | 'videos' | 'datasets'>('papers');
  const [papers, setPapers] = useState<ResearchPaper[]>([]);
  const [repos, setRepos] = useState<Repository[]>([]);
  const [videos, setVideos] = useState<LearningResource[]>([]);
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  useEffect(() => {
    apiService.getResources().then(res => {
      setPapers(res.papers);
      setRepos(res.repositories);
      setVideos(res.videos);
      setDatasets(res.datasets);
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5" /> Research & Discovery Hub
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">Academic Resources & Benchmarks</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Curated research papers (Crossref/arXiv DOIs), open-source GitHub repositories, video learning paths, and benchmark datasets.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'papers', label: 'Research Papers', icon: BookOpen, count: papers.length },
          { id: 'repos', label: 'GitHub Repositories', icon: GitFork, count: repos.length },
          { id: 'videos', label: 'Learning Videos', icon: Youtube, count: videos.length },
          { id: 'datasets', label: 'Datasets & APIs', icon: Database, count: datasets.length },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-brand-500/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">{tab.count}</span>
            </button>
          );
        })}
      </div>

      {/* Papers View */}
      {activeTab === 'papers' && (
        <div className="space-y-4">
          {papers.map(p => (
            <div key={p.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
                    Relevance: {p.relevance_score}%
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-2">{p.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.authors} ({p.year}) • {p.source}</p>
                </div>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 shrink-0"
                >
                  <span>DOI Link</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">{p.abstract}</p>
            </div>
          ))}
        </div>
      )}

      {/* Repos View */}
      {activeTab === 'repos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map(r => (
            <div key={r.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-sm">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-brand-600 dark:text-brand-400">{r.name}</span>
                  <span className="flex items-center gap-1 text-xs text-amber-500 dark:text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {r.stars.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 mt-2">{r.description}</p>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 mt-3">
                  <span className="font-semibold text-slate-900 dark:text-slate-200">Relevance: </span>{r.relevance_reason}
                </div>
              </div>
              <a
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="w-full text-center px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition"
              >
                View Repository
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Videos View */}
      {activeTab === 'videos' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map(v => (
            <div key={v.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Step {v.step_number}</span>
                <span>{v.duration}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{v.topic}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">{v.description}</p>
              <a
                href={v.video_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 dark:bg-rose-600/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition hover:bg-rose-500/20"
              >
                <Youtube className="w-4 h-4" /> Watch Tutorial
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Datasets View */}
      {activeTab === 'datasets' && (
        <div className="space-y-4">
          {datasets.map(d => (
            <div key={d.id} className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{d.name}</h3>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded text-slate-700 dark:text-slate-300">{d.size}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{d.source} • Format: {d.format} • License: {d.license}</p>
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-semibold text-brand-600 dark:text-brand-400">Recommended Usage: </span>{d.recommended_usage}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
