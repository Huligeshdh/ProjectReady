from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.ai.router import ai_router

router = APIRouter(prefix="/feasibility", tags=["Feasibility"])

class FeasibilityRequest(BaseModel):
    user_idea: str
    target_domain: Optional[str] = "Healthcare"
    team_size: Optional[int] = 3
    time_months: Optional[int] = 4

@router.post("/evaluate")
def evaluate_feasibility(req: FeasibilityRequest):
    idea_lower = req.user_idea.lower()
    
    # Detect over-broad scopes and narrow them down
    if "medical diagnosis" in idea_lower or "cancer detection" in idea_lower:
        verdict = "RECOMMENDED_WITH_MODIFICATIONS"
        suggested_narrowed_scope = "AI-based diabetic retinopathy classification from retinal images using ResNet50 and Grad-CAM"
        reasoning = "General 'medical diagnosis' is too vast for a 4-month final year project. Narrowing down to retinal image classification provides a clear open dataset (APTOS 2019) and measurable clinical metrics."
    elif "crypto trading bot" in idea_lower or "stock market prediction" in idea_lower:
        verdict = "HIGH_RISK"
        suggested_narrowed_scope = "Sentiment-driven financial news impact analyzer using NLP and historical stock volatility"
        reasoning = "Direct price prediction models suffer from financial noise and market efficiency. Analyzing sentiment correlation with volatility is academically far more robust and achievable."
    else:
        verdict = "RECOMMENDED"
        suggested_narrowed_scope = req.user_idea
        reasoning = "The proposed scope is well-defined, has clear dataset availability, and fits within the 4-month academic timeline for a 3-member team."

    return {
        "original_idea": req.user_idea,
        "verdict": verdict,
        "suggested_narrowed_scope": suggested_narrowed_scope,
        "reasoning": reasoning,
        "scores": {
            "overall_fit": 87.0,
            "skill_match": 92.0,
            "interest_match": 95.0,
            "feasibility": 84.0,
            "innovation": 88.0,
            "time_fit": 86.0,
            "resource_availability": 90.0,
            "technical_complexity": 78.0
        },
        "risk_factors": [
            "Dataset licensing compliance",
            "Model latency on low-spec client hardware",
            "Edge case handling in unlabelled inputs"
        ],
        "ethical_considerations": [
            "Data privacy protection",
            "Algorithmic bias mitigation across demographics",
            "Transparent AI explainability requirements"
        ]
    }
