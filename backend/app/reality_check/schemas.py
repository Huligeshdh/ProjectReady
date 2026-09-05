from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime

class DimensionDetailSchema(BaseModel):
    key: str
    name: str
    score: float
    weight: float
    measured_type: str # "Measured" | "AI Qualitative"
    strong_because: str
    weakness_note: str

class RiskDetailSchema(BaseModel):
    category: str
    risk_title: str
    severity: str
    probability: str
    impact_description: str
    mitigation_strategy: str

class PanelAttackPointSchema(BaseModel):
    id: Optional[int] = None
    severity: str # "CRITICAL" | "HIGH" | "MEDIUM"
    issue_title: str
    why_evaluator_challenges: str
    likely_evaluator_question: str
    recommended_answer: str
    recommended_fix: str
    related_component: str

class EvaluatorQuestionSchema(BaseModel):
    id: Optional[int] = None
    category: str
    question: str
    context_reason: str
    suggested_response_strategy: str

class ScoreHistoryItemSchema(BaseModel):
    id: Optional[int] = None
    run_number: int
    stage_name: str
    overall_score: float
    delta: float
    created_at: Optional[datetime] = None

class RealityCheckEvaluationResponse(BaseModel):
    id: int
    project_id: int
    evaluation_type: str # "PLAN" | "IMPLEMENTATION" | "RE_ANALYSIS"
    overall_score: float
    classification: str # "Excellent" | "Strong" | "Good" | "Risky" | "Weak" | "High Risk"
    planned_score: float
    implemented_score: float
    implementation_gap: float
    strengths: List[str]
    ai_summary: str
    dimensions: List[DimensionDetailSchema]
    risks: List[RiskDetailSchema]
    panel_attack_points: List[PanelAttackPointSchema]
    evaluator_questions: List[EvaluatorQuestionSchema]
    score_history: List[ScoreHistoryItemSchema]
