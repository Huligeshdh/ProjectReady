export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
}

export interface StudentProfile {
  id: number;
  degree: string;
  branch: string;
  academic_year: string;
  programming_languages: string[];
  frameworks: string[];
  databases: string[];
  ai_ml_skills: string[];
  cloud_skills: string[];
  other_skills: string[];
  interests: string[];
  team_size: number;
  available_time_months: number;
  budget_usd: number;
  hardware_gpu: string;
  experience_level: string;
  preferred_project_type: string;
}

export interface ProjectIdea {
  id: number;
  title: string;
  one_liner: string;
  problem_statement: string;
  target_users: string;
  why_it_matters: string;
  core_features: string[];
  advanced_features: string[];
  required_skills: string[];
  recommended_tech: string[];
  dataset_api_requirements: string;
  estimated_duration_months: number;
  difficulty: string;
  overall_score: number;
  skill_match_score: number;
  feasibility_score: number;
  innovation_score: number;
  time_fit_score: number;
  resource_availability_score: number;
  complexity_score: number;
}

export interface FeasibilityVerdict {
  original_idea: string;
  verdict: 'RECOMMENDED' | 'RECOMMENDED_WITH_MODIFICATIONS' | 'HIGH_RISK' | 'NOT_RECOMMENDED';
  suggested_narrowed_scope: string;
  reasoning: string;
  scores: {
    overall_fit: number;
    skill_match: number;
    interest_match: number;
    feasibility: number;
    innovation: number;
    time_fit: number;
    resource_availability: number;
    technical_complexity: number;
  };
  risk_factors: string[];
  ethical_considerations: string[];
}

export interface ProjectBlueprint {
  id: number;
  project_id: number;
  overview: string;
  problem_statement: string;
  objectives: string[];
  target_users: string;
  functional_requirements: string[];
  non_functional_requirements: string[];
  tech_stack: Record<string, string>;
  system_architecture: string;
  database_architecture: string;
  api_architecture: string;
  ai_ml_architecture: string;
  security_considerations: string[];
  dataset_requirements: string;
  expected_results: string;
  risks: string[];
  future_scope: string[];
}

export interface ResearchPaper {
  id: number;
  title: string;
  authors: string;
  year: number;
  abstract: string;
  relevance_score: number;
  doi: string;
  source: string;
  url: string;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  language: string;
  stars: number;
  topics: string[];
  last_updated: string;
  relevance_reason: string;
  url: string;
}

export interface LearningResource {
  id: number;
  step_number: number;
  topic: string;
  description: string;
  video_title: string;
  video_url: string;
  duration: string;
  channel: string;
}

export interface Dataset {
  id: number;
  name: string;
  source: string;
  size: string;
  format: string;
  license: string;
  recommended_usage: string;
  url: string;
}

export interface RoadmapTask {
  id: number;
  phase_id: number;
  task_number: number;
  title: string;
  description: string;
  estimated_days: number;
  priority: 'High' | 'Medium' | 'Low';
  is_completed: boolean;
}

export interface RoadmapPhase {
  id: number;
  phase_number: number;
  title: string;
  description: string;
  tasks: RoadmapTask[];
}

export interface MentorMessage {
  id: number;
  sender: 'user' | 'ai';
  content: string;
  provider_used: string;
  grounded_sources: string[];
  timestamp: string;
}

export interface MentorConversation {
  id: number;
  title: string;
  created_at: string;
  updated_at?: string;
  message_count?: number;
  last_message?: string;
}

export interface CodeReviewIssue {
  id: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFO';
  category: 'Bug' | 'Code Quality' | 'Security' | 'Architecture' | 'Testing';
  file_path: string;
  line_number: number;
  problem: string;
  why_it_matters: string;
  impact: string;
  recommended_fix: string;
  original_code?: string;
  suggested_code?: string;
  is_resolved?: boolean;
}

export interface CodeReviewCriterion {
  score: number;
  weight: number;
  label: string;
  evidence: string;
}

export interface CodeReviewAlignmentRow {
  feature: string;
  implementation: string;
  status: string;
  evidence: string;
}

export interface CodeReviewAlignment {
  score: number;
  problem_statement: string;
  planned_features_count: number;
  detected_features_count: number;
  matrix: CodeReviewAlignmentRow[];
  summary: string;
}

export interface CodeReview {
  id: number;
  project_id: number;
  run_number: number;
  zip_filename: string;
  total_files: number;
  total_lines: number;
  languages_detected: string[];
  frameworks_detected: string[];
  health_score: number;
  submission_score?: number;
  created_at: string;
  issues?: CodeReviewIssue[];
  criteria?: Record<string, CodeReviewCriterion>;
  alignment?: CodeReviewAlignment;
}

export interface ProjectHealth {
  overall_score: number;
  metrics: {
    code_quality: number;
    architecture: number;
    security: number;
    testing: number;
    performance: number;
    maintainability: number;
    documentation: number;
    innovation: number;
    feasibility: number;
  };
  measured_metrics: Record<string, any>;
  ai_qualitative_assessment: string;
  total_runs: number;
}

export interface ProjectImprovement {
  id: number;
  title: string;
  category: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  problem_summary: string;
  impact: string;
  recommended_action: string;
  estimated_effort: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

export interface ReanalysisComparison {
  has_comparison: boolean;
  previous_run_number: number;
  current_run_number: number;
  before_score: number;
  after_score: number;
  overall_delta: number;
  deltas: {
    security_delta: number;
    testing_delta: number;
    code_quality_delta: number;
    architecture_delta: number;
  };
  resolved_issues_count: number;
  remaining_issues_count: number;
}

export interface DimensionDetail {
  key: string;
  name: string;
  score: number;
  weight: number;
  measured_type: 'Measured' | 'AI Qualitative';
  strong_because: string;
  weakness_note: string;
}

export interface RiskDetail {
  category: string;
  risk_title: string;
  severity: string;
  probability: string;
  impact_description: string;
  mitigation_strategy: string;
}

export interface PanelAttackPoint {
  id?: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  issue_title: string;
  why_evaluator_challenges: string;
  likely_evaluator_question: string;
  recommended_answer: string;
  recommended_fix: string;
  related_component: string;
}

export interface EvaluatorQuestion {
  id?: number;
  category: string;
  question: string;
  context_reason: string;
  suggested_response_strategy: string;
}

export interface ScoreHistoryItem {
  id?: number;
  run_number: number;
  stage_name: string;
  overall_score: number;
  delta: number;
  created_at?: string;
}

export interface RealityCheckEvaluation {
  id: number;
  project_id: number;
  evaluation_type: 'PLAN' | 'IMPLEMENTATION' | 'RE_ANALYSIS';
  overall_score: number;
  classification: string;
  planned_score: number;
  implemented_score: number;
  implementation_gap: number;
  strengths: string[];
  ai_summary: string;
  dimensions: DimensionDetail[];
  risks: RiskDetail[];
  panel_attack_points: PanelAttackPoint[];
  evaluator_questions: EvaluatorQuestion[];
  score_history: ScoreHistoryItem[];
}

