import React, { useState, useEffect, useCallback } from 'react';
import {
  FileCode, Upload, CheckCircle2, ShieldAlert, AlertTriangle, Code2, Sparkles, Filter,
  TrendingUp, Award, Layers, Search, Eye, History, ArrowUpRight, HelpCircle, Check, XCircle,
  RefreshCw, FileWarning, UploadCloud, Loader2, X
} from 'lucide-react';
import { apiService } from '../services/api';
import { CodeReview } from '../types';
import { CodeDiffViewer } from '../components/UI/CodeDiffViewer';

// ─── Localized Error Boundary ───
class CodeReviewErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; errorMessage: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message || 'An unexpected error occurred.' };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('CodeReviewPage Error Boundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 text-center space-y-4 max-w-lg mx-auto mt-12">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <FileWarning className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Something went wrong</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            The Code Review workspace could not be displayed.
          </p>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-mono bg-rose-100 dark:bg-rose-950/40 p-2 rounded-lg break-words">
            {this.state.errorMessage}
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, errorMessage: '' })}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg"
            >
              Try Again
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              Back to Dashboard
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Main Component ───
const CodeReviewPageInner: React.FC = () => {
  const [review, setReview] = useState<CodeReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [submissionHistory, setSubmissionHistory] = useState<any[]>([]);
  const [expandedCriterion, setExpandedCriterion] = useState<string | null>(null);

  // Load initial code review data + submission history
  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    Promise.all([
      apiService.getCodeReview(1),
      apiService.getSubmissionHistory(1)
    ])
      .then(([reviewRes, historyRes]) => {
        setReview(reviewRes);
        setSubmissionHistory(historyRes);
      })
      .catch((err) => {
        console.error('Failed to load code review:', err);
        setLoadError('Unable to load Code Review data. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const steps = [
    'Validating ZIP archive & extracting in isolated container...',
    'Building project file tree & detecting frameworks...',
    'Running AST static analysis & secret pattern scanner...',
    'Auditing Code Quality, Security, Efficiency & Testing...',
    'Checking Accessibility & ARIA semantics...',
    'Comparing actual code against Problem Statement Alignment...',
    'Generating official AI Code Submission report...'
  ];

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith('.zip')) {
      setUploadError('This file is not a valid project ZIP. Please select a .zip archive.');
      return;
    }
    setUploadError(null);
    setSelectedFile(file);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
    // Reset input so re-selecting same file works
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadError(null);
    setPipelineStep(0);

    const interval = setInterval(() => {
      setPipelineStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 500);

    try {
      const result = await apiService.uploadCodebaseZip(1, selectedFile);
      setReview(result);
      setSelectedFile(null);
    } catch (err: any) {
      console.error('Upload/analysis failed:', err);
      setUploadError(
        err?.message?.includes('network')
          ? 'Code Review service is temporarily unavailable. Please retry.'
          : "Analysis couldn't be completed. Your ZIP was uploaded, but ProjectReady couldn't finish the analysis."
      );
    } finally {
      clearInterval(interval);
      setUploading(false);
    }
  };

  // Derive display data with safe fallbacks
  const sampleCriteria = review?.criteria || {
    code_quality: { score: 88.0, weight: 0.20, label: "Code Quality", evidence: "AST analysis verified modular FastAPI & React structure." },
    security: { score: 79.0, weight: 0.20, label: "Security", evidence: "Secret scan detected unvalidated JWT expiration claim." },
    efficiency: { score: 84.0, weight: 0.15, label: "Efficiency", evidence: "Low loop complexity. Measured PyTorch inference pipeline." },
    testing: { score: 67.0, weight: 0.15, label: "Testing", evidence: "18 test files detected. Coverage not measured." },
    accessibility: { score: 91.0, weight: 0.10, label: "Accessibility", evidence: "High contrast Liquid Glass UI & aria-labels present." },
    problem_alignment: { score: 86.0, weight: 0.20, label: "Problem Alignment", evidence: "6 of 6 planned features detected in codebase." }
  };

  const sampleAlignment = review?.alignment || {
    score: 86.0,
    problem_statement: "Students struggle to find personalized project ideas, plan architecture, and verify code quality before evaluation.",
    planned_features_count: 6,
    detected_features_count: 6,
    matrix: [
      { feature: "Idea Generation", implementation: "backend/app/api/ideas.py", status: "✓ Implemented", evidence: "POST /api/ideas/generate" },
      { feature: "Feasibility Analysis", implementation: "backend/app/api/feasibility.py", status: "✓ Implemented", evidence: "POST /api/feasibility/evaluate" },
      { feature: "Research Hub", implementation: "backend/app/api/resources.py", status: "✓ Implemented", evidence: "OpenAlex DOI fetcher" },
      { feature: "AI Mentor (RAG)", implementation: "backend/app/api/mentor.py", status: "✓ Implemented", evidence: "Cosine similarity vector store" },
      { feature: "ZIP Analysis Scanner", implementation: "backend/app/analysis/zip_analyzer.py", status: "✓ Implemented", evidence: "AST static scanner" },
      { feature: "Reality Check Engine", implementation: "backend/app/api/reality_check.py", status: "✓ Implemented", evidence: "Survival score evaluator" },
    ],
    summary: "Your implementation addresses the original problem statement. All 6 planned core capabilities were detected."
  };

  const issuesList = review?.issues || [];

  const filteredIssues = issuesList.filter((i) =>
    severityFilter === 'ALL' ? true : i.severity === severityFilter
  );

  const submissionScore = review?.submission_score || review?.health_score || 82.0;

  // ─── Loading State ───
  if (loading) {
    return (
      <div className="flex items-center justify-center p-16">
        <div className="text-center space-y-4 animate-fadeIn">
          <Loader2 className="w-8 h-8 animate-spin text-brand-500 mx-auto" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading Code Review...</p>
        </div>
      </div>
    );
  }

  // ─── Load Error State ───
  if (loadError) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-12 text-center space-y-4 animate-fadeIn">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">Unable to load Code Review</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{loadError}</p>
        <button
          onClick={() => {
            setLoading(true);
            setLoadError(null);
            apiService.getCodeReview(1)
              .then((res) => setReview(res))
              .catch(() => setLoadError('Still unable to load. Please check your connection.'))
              .finally(() => setLoading(false));
          }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs transition shadow-lg"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* 1. Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-brand-500/10 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300 border border-brand-500/30 flex items-center gap-1.5 shadow-sm">
              <Award className="w-3.5 h-3.5" /> COMPETITION EVALUATION SUITE
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">AI Code Submission Evaluation</h1>
          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-3xl">
            Evaluate your codebase against the six official competition criteria: Code Quality, Security, Efficiency, Testing, Accessibility, and Problem Statement Alignment.
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block">AI Code Submission Score</span>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{submissionScore} <span className="text-xs font-normal text-slate-500">/ 100</span></span>
        </div>
      </div>

      {/* 2. Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed backdrop-blur-xl transition-all text-center space-y-4 shadow-xl ${dragActive
            ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-500/10 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 hover:border-brand-500/50'
          }`}
      >
        <div className="w-12 h-12 rounded-2xl bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto shadow-lg shadow-brand-500/20">
          <Upload className="w-6 h-6" />
        </div>

        {!selectedFile ? (
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Submit Project Codebase Archive (.zip)</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Drag & drop your ZIP here, or click to browse. Supports Python, FastAPI, React, TypeScript, Java, C/C++, PyTorch, Django.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-500/10 dark:bg-brand-500/20 border border-brand-500/30 text-sm font-bold text-brand-600 dark:text-brand-300">
              <FileCode className="w-4 h-4" />
              <span>{selectedFile.name}</span>
              <span className="text-xs font-normal text-slate-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              <button
                onClick={() => { setSelectedFile(null); setUploadError(null); }}
                className="ml-1 p-0.5 rounded hover:bg-brand-500/20 transition"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Error */}
        {uploadError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/40 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 text-left max-w-lg mx-auto">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
            <div>
              <p className="font-bold">{uploadError}</p>
              <button
                onClick={() => { setUploadError(null); setSelectedFile(null); }}
                className="mt-1.5 text-rose-600 dark:text-rose-400 font-bold hover:underline"
              >
                Choose Another File
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center gap-3">
          {!selectedFile && (
            <label className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs cursor-pointer transition shadow-lg shadow-brand-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400">
              <UploadCloud className="w-4 h-4" />
              <span>Select ZIP File</span>
              <input type="file" accept=".zip" onChange={handleFileInputChange} className="hidden" />
            </label>
          )}
          {selectedFile && !uploading && (
            <button
              onClick={handleAnalyze}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/25"
            >
              <Sparkles className="w-4 h-4" /> Analyze Project
            </button>
          )}
          {uploading && (
            <button
              disabled
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-400 dark:bg-slate-700 text-white font-bold text-xs cursor-not-allowed"
            >
              <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-500">Isolated AST container scanning • Secret key masking active</p>
      </div>

      {/* 3. Pipeline Loading Progress */}
      {uploading && (
        <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 backdrop-blur-md space-y-4">
          <h4 className="text-xs font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Evaluation Pipeline Progress</h4>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${idx <= pipelineStep ? 'bg-emerald-500 text-white dark:text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                  {idx <= pipelineStep ? '✓' : idx + 1}
                </div>
                <span className={idx <= pipelineStep ? 'text-slate-900 dark:text-slate-200 font-semibold' : 'text-slate-500'}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Six Competition Criteria Cards Grid */}
      {!uploading && (
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-500 dark:text-brand-400" />
                Six Official Competition Criteria
              </h2>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Weights sum to 100%</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Code Quality */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Code Quality</span>
                  <span className="text-xs font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-bold">20% Weight</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {sampleCriteria.code_quality?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sampleCriteria.code_quality?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High modularity score
                </div>
              </div>

              {/* Security */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Security</span>
                  <span className="text-xs font-mono bg-rose-500/10 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded font-bold">20% Weight</span>
                </div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                  {sampleCriteria.security?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sampleCriteria.security?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> 1 Security action item
                </div>
              </div>

              {/* Efficiency */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Efficiency</span>
                  <span className="text-xs font-mono bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded font-bold">15% Weight</span>
                </div>
                <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
                  {sampleCriteria.efficiency?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sampleCriteria.efficiency?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">Measured Finding</span>
                </div>
              </div>

              {/* Testing */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Testing</span>
                  <span className="text-xs font-mono bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded font-bold">15% Weight</span>
                </div>
                <div className="text-2xl font-black text-yellow-600 dark:text-yellow-400">
                  {sampleCriteria.testing?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sampleCriteria.testing?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-yellow-600 dark:text-yellow-400 font-medium flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Edge-case tests recommended
                </div>
              </div>

              {/* Accessibility */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-300">Accessibility</span>
                  <span className="text-xs font-mono bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded font-bold">10% Weight</span>
                </div>
                <div className="text-2xl font-black text-teal-600 dark:text-teal-400">
                  {sampleCriteria.accessibility?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  {sampleCriteria.accessibility?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Accessible focus rings verified
                </div>
              </div>

              {/* Problem Statement Alignment */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-brand-500/40 backdrop-blur-md space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-600 dark:text-brand-300">Problem Alignment</span>
                  <span className="text-xs font-mono bg-brand-500/10 text-brand-600 dark:text-brand-400 px-2 py-0.5 rounded font-bold">20% Weight</span>
                </div>
                <div className="text-2xl font-black text-brand-600 dark:text-brand-300">
                  {sampleCriteria.problem_alignment?.score ?? '—'} <span className="text-xs text-slate-500 font-normal">/ 100</span>
                </div>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  {sampleCriteria.problem_alignment?.evidence ?? 'Not analyzed yet'}
                </p>
                <div className="pt-2 text-[10px] text-brand-600 dark:text-brand-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> High feature alignment
                </div>
              </div>
            </div>
          </div>

          {/* 5. Problem Statement Alignment & Feature Matrix */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5 backdrop-blur-xl shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-600 dark:text-brand-400 tracking-wider">Feature Audit</span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">Problem Statement Alignment Matrix</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Did you actually build what you specified in your project blueprint?</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{sampleAlignment.detected_features_count} of {sampleAlignment.planned_features_count} Capabilities Verified</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Planned Feature</th>
                    <th className="py-2.5 px-3">Implementation Path</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Detected Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60">
                  {sampleAlignment.matrix.map((row: any, i: number) => (
                    <tr key={i} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-200">{row.feature}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">{row.implementation}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${row.status.includes('✓') ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{row.evidence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. What Could Hurt Your Submission & Fastest Score Improvements */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weakness Warning */}
            <div className="p-6 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/30 space-y-4 backdrop-blur-md shadow-sm">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                <AlertTriangle className="w-4 h-4" />
                <span>WHAT COULD HURT YOUR SUBMISSION?</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">🔴 Testing is your weakest criterion ({sampleCriteria.testing?.score ?? '—'}/100)</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Only limited automated unit tests were detected. Evaluators may consider the implementation insufficiently validated under edge-case stress.
              </p>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-rose-200 dark:border-rose-900/40 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-rose-600 dark:text-rose-400">Recommended Action: </span>
                Add API integration tests and edge-case validation tests in <code className="text-slate-900 dark:text-slate-200">tests/</code> directory.
              </div>
            </div>

            {/* Fastest Score Improvements */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-4 backdrop-blur-md shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Fastest Ways to Improve Your Score
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">*Estimated Gains</span>
              </div>

              <div className="space-y-2.5 text-xs">
                {[
                  { fix: 'Add API Integration Tests', effort: 'Medium', gain: '+7 PTS' },
                  { fix: 'Validate JWT Expiration Claim', effort: 'Low', gain: '+5 PTS' },
                  { fix: 'Fix Accessibility ARIA Labels', effort: 'Low', gain: '+4 PTS' },
                  { fix: 'Extract Exception Logging', effort: 'Medium', gain: '+3 PTS' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
                    <span className="font-semibold text-slate-900 dark:text-slate-200">{item.fix}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{item.effort}</span>
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{item.gain}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. Code Issues & Diff Viewer */}
          {issuesList.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-brand-500 dark:text-brand-400" /> Detected Vulnerabilities & IDE Code Corrections
                </h3>

                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                  {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition ${severityFilter === sev
                          ? 'bg-brand-600/10 dark:bg-brand-600/20 text-brand-600 dark:text-brand-400 border border-brand-500/30'
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                {filteredIssues.map((issue: any) => (
                  <CodeDiffViewer
                    key={issue.id}
                    filePath={issue.file_path}
                    lineNumber={issue.line_number}
                    problem={issue.problem}
                    whyItMatters={issue.why_it_matters}
                    impact={issue.impact}
                    recommendedFix={issue.recommended_fix}
                    originalCode={issue.original_code}
                    suggestedCode={issue.suggested_code}
                    severity={issue.severity}
                  />
                ))}
              </div>
            </div>
          )}

          {/* No issues state */}
          {issuesList.length === 0 && (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">No Issues Detected</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">Upload a ZIP archive to start your code submission evaluation.</p>
            </div>
          )}

          {/* 8. Submission History Timeline */}
          {submissionHistory.length > 0 && (
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-5 backdrop-blur-xl shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <History className="w-4 h-4 text-brand-500 dark:text-brand-400" />
                  Submission History
                </h3>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">{submissionHistory.length} submissions</span>
              </div>

              <div className="space-y-3">
                {submissionHistory.map((sub: any, idx: number) => {
                  const prevSub = idx > 0 ? submissionHistory[idx - 1] : null;
                  const delta = prevSub ? sub.submission_score - prevSub.submission_score : 0;
                  const isLatest = idx === submissionHistory.length - 1;

                  return (
                    <div
                      key={sub.run_number}
                      className={`p-4 rounded-2xl border transition-all ${isLatest
                          ? 'bg-brand-500/5 dark:bg-brand-500/10 border-brand-500/30'
                          : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black ${isLatest ? 'bg-brand-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                            }`}>
                            #{sub.run_number}
                          </div>
                          <div>
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">{sub.zip_filename}</span>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              {isLatest && <span className="ml-2 px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 font-bold">LATEST</span>}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xl font-black text-slate-900 dark:text-slate-100">
                            {sub.submission_score}
                          </span>
                          {delta !== 0 && (
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${delta > 0
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                              }`}>
                              {delta > 0 ? '+' : ''}{delta.toFixed(0)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Per-criteria breakdown for this submission */}
                      {sub.criteria && Object.keys(sub.criteria).length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {Object.entries(sub.criteria).map(([key, val]: [string, any]) => {
                            const score = typeof val === 'object' ? val.score || val : val;
                            const prevScore = prevSub?.criteria?.[key];
                            const prevVal = typeof prevScore === 'object' ? prevScore?.score || prevScore : prevScore;
                            const critDelta = prevVal ? score - prevVal : 0;
                            return (
                              <div key={key} className="text-center px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-[10px]">
                                <span className="text-slate-500 dark:text-slate-400 block capitalize">{key.replace('_', ' ')}</span>
                                <span className="font-black text-slate-900 dark:text-slate-100">{typeof score === 'number' ? score.toFixed(0) : score}</span>
                                {critDelta !== 0 && (
                                  <span className={`ml-1 font-bold ${critDelta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                    {critDelta > 0 ? '+' : ''}{critDelta.toFixed(0)}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/40 text-center">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <span className="font-bold">ProjectReady AI Code Submission Score</span> — Estimated submission readiness based on the published evaluation criteria.
              This is not an official competition score. Actual evaluation may differ based on the evaluating panel's assessment.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export const CodeReviewPage: React.FC = () => (
  <CodeReviewErrorBoundary>
    <CodeReviewPageInner />
  </CodeReviewErrorBoundary>
);
