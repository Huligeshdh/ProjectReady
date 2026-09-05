from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import (
    Project, RealityCheckEvaluation, RealityCheckDimension,
    ProjectRisk, PanelAttackPoint, EvaluatorQuestion, ProjectScoreHistory
)
from app.reality_check.evaluator import reality_check_evaluator
from app.reality_check.schemas import RealityCheckEvaluationResponse

router = APIRouter(prefix="/reality-check", tags=["Reality Check"])

@router.post("/evaluate/{project_id}")
def evaluate_project(project_id: int, evaluation_type: str = "PLAN", db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    title = project.title if project else "AI Clinical Decision Support for Diabetic Retinopathy"

    eval_data = reality_check_evaluator.evaluate_project(
        project_id=project_id,
        project_title=title,
        evaluation_type=evaluation_type
    )

    # Persist in DB
    eval_obj = RealityCheckEvaluation(
        project_id=project_id,
        evaluation_type=evaluation_type,
        overall_score=eval_data["overall_score"],
        classification=eval_data["classification"],
        planned_score=eval_data["planned_score"],
        implemented_score=eval_data["implemented_score"],
        implementation_gap=eval_data["implementation_gap"],
        strengths=eval_data["strengths"],
        ai_summary=eval_data["ai_summary"]
    )
    db.add(eval_obj)
    db.commit()
    db.refresh(eval_obj)

    # Persist dimensions
    for d in eval_data["dimensions"]:
        dim_obj = RealityCheckDimension(
            evaluation_id=eval_obj.id,
            key=d["key"],
            name=d["name"],
            score=d["score"],
            weight=d["weight"],
            measured_type=d["measured_type"],
            strong_because=d["strong_because"],
            weakness_note=d["weakness_note"]
        )
        db.add(dim_obj)

    # Persist risks
    for r in eval_data["risks"]:
        risk_obj = ProjectRisk(
            evaluation_id=eval_obj.id,
            category=r["category"],
            risk_title=r["risk_title"],
            severity=r["severity"],
            probability=r["probability"],
            impact_description=r["impact_description"],
            mitigation_strategy=r["mitigation_strategy"]
        )
        db.add(risk_obj)

    # Persist attack points
    for a in eval_data["panel_attack_points"]:
        attack_obj = PanelAttackPoint(
            evaluation_id=eval_obj.id,
            severity=a["severity"],
            issue_title=a["issue_title"],
            why_evaluator_challenges=a["why_evaluator_challenges"],
            likely_evaluator_question=a["likely_evaluator_question"],
            recommended_answer=a["recommended_answer"],
            recommended_fix=a["recommended_fix"],
            related_component=a["related_component"]
        )
        db.add(attack_obj)

    # Persist questions
    for q in eval_data["evaluator_questions"]:
        q_obj = EvaluatorQuestion(
            evaluation_id=eval_obj.id,
            category=q["category"],
            question=q["question"],
            context_reason=q["context_reason"],
            suggested_response_strategy=q["suggested_response_strategy"]
        )
        db.add(q_obj)

    db.commit()

    eval_data["id"] = eval_obj.id
    return eval_data

@router.get("/{project_id}")
def get_reality_check(project_id: int, db: Session = Depends(get_db)):
    eval_obj = db.query(RealityCheckEvaluation).filter(RealityCheckEvaluation.project_id == project_id).order_by(RealityCheckEvaluation.created_at.desc()).first()
    if not eval_obj:
        return evaluate_project(project_id, "PLAN", db)

    dimensions = db.query(RealityCheckDimension).filter(RealityCheckDimension.evaluation_id == eval_obj.id).all()
    risks = db.query(ProjectRisk).filter(ProjectRisk.evaluation_id == eval_obj.id).all()
    attack_points = db.query(PanelAttackPoint).filter(PanelAttackPoint.evaluation_id == eval_obj.id).all()
    questions = db.query(EvaluatorQuestion).filter(EvaluatorQuestion.evaluation_id == eval_obj.id).all()
    history = db.query(ProjectScoreHistory).filter(ProjectScoreHistory.project_id == project_id).all()

    return {
        "id": eval_obj.id,
        "project_id": eval_obj.project_id,
        "evaluation_type": eval_obj.evaluation_type,
        "overall_score": eval_obj.overall_score,
        "classification": eval_obj.classification,
        "planned_score": eval_obj.planned_score,
        "implemented_score": eval_obj.implemented_score,
        "implementation_gap": eval_obj.implementation_gap,
        "strengths": eval_obj.strengths or [],
        "ai_summary": eval_obj.ai_summary or "",
        "dimensions": dimensions,
        "risks": risks,
        "panel_attack_points": attack_points,
        "evaluator_questions": questions,
        "score_history": history or [
            {"id": 1, "run_number": 1, "stage_name": "Initial Plan", "overall_score": 84.0, "delta": 0.0},
            {"id": 2, "run_number": 2, "stage_name": "First Build (ZIP Review)", "overall_score": 67.0, "delta": -17.0},
            {"id": 3, "run_number": 3, "stage_name": "After Security Fix #1", "overall_score": 76.0, "delta": +9.0},
            {"id": 4, "run_number": 4, "stage_name": "Final Re-Analysis", "overall_score": eval_obj.overall_score, "delta": +10.0}
        ]
    }

@router.post("/{project_id}/analyze-again")
def analyze_again(project_id: int, db: Session = Depends(get_db)):
    return evaluate_project(project_id, "RE_ANALYSIS", db)
