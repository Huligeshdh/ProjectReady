# ProjectReady

> **Build it. Test it. Improve it. Make it final-ready.**

ProjectReady helps final-year students turn project ideas into practical, research-backed, and evaluation-ready academic projects — then analyzes what they actually built and shows them exactly what to improve before evaluation.

```text
LANDING PAGE
     ↓
SIGN UP / LOGIN
     ↓
STUDENT ONBOARDING
     ↓
┌──────────────────────────────────────────────────────────┐
│ 1. DASHBOARD                                             │
│ 2. PROJECT BUILDER (Ideas → Feasibility → Blueprint → Roadmap) │
│ 3. RESEARCH HUB (Papers → Repos → Datasets → Learning)   │
│ 4. AI MENTOR (Project-Grounded RAG Assistant)            │
│ 5. REVIEW & HEALTH (ZIP Upload → Health → Reality Check) │
└──────────────────────────────────────────────────────────┘
```

---

## Technical Stack

### Frontend
- **React 18** with **TypeScript** & **Vite**
- **Tailwind CSS** with Liquid Glass dark & light theme system
- **Lucide Icons**, **Recharts**
- **IDE Code Diff Visualizer**

### Backend
- **Python FastAPI** REST APIs
- **SQLAlchemy ORM** & SQLite/PostgreSQL
- **Safe ZIP Extraction** & AST Static Code Analysis
- **RAG Cosine Similarity Vector Store**

### AI Provider Abstraction
Supports 4 providers with task-based routing and resilient fallbacks:
- **Google Gemini API** (Idea generation, Research summaries)
- **OpenAI API** (Code review, Security vulnerability analysis)
- **NVIDIA API** (High-performance Llama 3.1 fallback)
- **Ollama** (Local private code analysis)

---

## Quick Start Guide

### 1. Launch Frontend
```bash
cd frontend
npm install
npm run dev
```
Access public Landing Page at `http://localhost:3000`.

### 2. Launch Backend Service
```bash
cd backend
python app/seed.py
python start_backend.py
```
Access REST API documentation at `http://localhost:8000/docs`.

---

## Core Product Workspaces

1. **ProjectReady Public Landing Page**: Showcases product philosophy, 5-step workflow, Project Reality Check before/after comparison, and interactive preview.
2. **Student Profile Onboarding**: Collects branch, skills, team size, budget, time, and hardware constraints.
3. **Project Builder**: Ideas generator, Feasibility Engine, Architecture Blueprint, and 10-Phase Development Roadmap.
4. **Research Hub**: Curated research papers (Crossref/arXiv DOIs), GitHub repositories, datasets, and video learning paths.
5. **AI Mentor**: Grounded RAG assistant referencing student project specs and indexed research memory.
6. **Review & Health**: Safe ZIP extraction, AST static code review, Project Health metrics, Project Survival Score engine, and score re-analysis loop (`Analyze Again`).
