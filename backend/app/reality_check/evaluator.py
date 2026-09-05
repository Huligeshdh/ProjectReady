import json
from typing import Dict, Any, List
from app.reality_check.scoring import scoring_engine
from app.reality_check.panel_attack import panel_attack_engine
from app.reality_check.risk_engine import risk_engine
from app.reality_check.comparison import comparison_engine
from app.ai.router import ai_router

class ProjectRealityCheckEvaluator:
    """Master Orchestrator for Project Reality Check & Survival Score Evaluation."""

    def evaluate_project(
        self,
        project_id: int,
        project_title: str,
        evaluation_type: str = "PLAN",
        static_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        
        # Raw dimension defaults
        raw_scores = {
            "problem_validity": 92.0,
            "originality": 84.0,
            "research_depth": 88.0,
            "technical_complexity": 91.0,
            "feasibility": 79.0,
            "dataset_feasibility": 90.0,
            "technology_feasibility": 92.0,
            "time_feasibility": 85.0,
            "security": 71.0 if evaluation_type != "PLAN" else 85.0,
            "scalability": 81.0,
            "testing_evaluation": 68.0 if evaluation_type != "PLAN" else 82.0,
            "industry_relevance": 89.0,
            "documentation_readiness": 90.0,
            "innovation": 86.0
        }

        if evaluation_type == "RE_ANALYSIS":
            raw_scores["security"] = 88.0
            raw_scores["testing_evaluation"] = 85.0

        # Calculate survival score & dimensions
        score_res = scoring_engine.calculate_survival_score(raw_scores, static_metrics)
        overall_score = score_res["overall_score"]
        classification = score_res["classification"]

        # Attack points, questions, risks
        attack_points = panel_attack_engine.generate_attack_points(project_title, "FastAPI, PyTorch, React")
        questions = panel_attack_engine.generate_evaluator_questions(project_title)
        risks = risk_engine.evaluate_risks(project_title)

        # Plan vs Implementation comparison
        planned_score = 84.0
        implemented_score = 67.0 if evaluation_type == "IMPLEMENTATION" else (86.0 if evaluation_type == "RE_ANALYSIS" else 84.0)
        comp = comparison_engine.calculate_gap(planned_score, implemented_score)

        # AI Summary Generation
        prompt = f"Evaluate project '{project_title}' (Survival Score: {overall_score}/100, Classification: {classification}). Summarize in 2 sentences."
        ai_resp = ai_router.execute_task("idea_generation", prompt)

        return {
            "project_id": project_id,
            "evaluation_type": evaluation_type,
            "overall_score": overall_score,
            "classification": classification,
            "planned_score": planned_score,
            "implemented_score": implemented_score,
            "implementation_gap": comp["implementation_gap"],
            "strengths": [
                "Strong technical architecture combining PyTorch deep learning with FastAPI & React.",
                "Well-defined clinical problem statement with high real-world demand.",
                "Research-backed methodology utilizing Grad-CAM explainable AI.",
                "Modular code structure adhering to clean separation of concerns."
            ],
            "ai_summary": ai_resp["content"],
            "dimensions": score_res["dimensions"],
            "risks": risks,
            "panel_attack_points": attack_points,
            "evaluator_questions": questions,
            "score_history": comparison_engine.generate_default_history(overall_score)
        }

reality_check_evaluator = ProjectRealityCheckEvaluator()
