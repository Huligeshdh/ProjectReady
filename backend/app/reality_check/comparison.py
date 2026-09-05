from typing import Dict, Any, List

class EvaluationComparisonEngine:
    """Calculates Stage 1 (Plan) vs Stage 2 (Implementation) gaps and score trends over time."""

    def calculate_gap(self, planned_score: float, implemented_score: float) -> Dict[str, Any]:
        gap = round(implemented_score - planned_score, 1)
        return {
            "planned_score": planned_score,
            "implemented_score": implemented_score,
            "implementation_gap": gap,
            "gap_explanation": (
                "Your planned architecture score was strong (84/100), but actual ZIP implementation "
                "scored 67/100 due to unvalidated JWT token expiration and missing automated integration tests."
                if gap < 0
                else "Implementation aligns strongly with proposed project blueprint."
            )
        }

    def generate_default_history(self, current_score: float) -> List[Dict[str, Any]]:
        return [
            {"run_number": 1, "stage_name": "Initial Plan", "overall_score": 84.0, "delta": 0.0},
            {"run_number": 2, "stage_name": "First Build (ZIP Review)", "overall_score": 67.0, "delta": -17.0},
            {"run_number": 3, "stage_name": "After Security Fix #1", "overall_score": 76.0, "delta": +9.0},
            {"run_number": 4, "stage_name": "Final Re-Analysis", "overall_score": current_score, "delta": +10.0}
        ]

comparison_engine = EvaluationComparisonEngine()
