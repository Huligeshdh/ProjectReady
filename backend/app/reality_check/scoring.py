from typing import Dict, Any, List

DEFAULT_DIMENSION_WEIGHTS = {
    "problem_validity": {"name": "Problem Validity", "weight": 0.08, "type": "AI Qualitative"},
    "originality": {"name": "Originality", "weight": 0.10, "type": "AI Qualitative"},
    "research_depth": {"name": "Research Depth", "weight": 0.08, "type": "AI Qualitative"},
    "technical_complexity": {"name": "Technical Complexity", "weight": 0.10, "type": "Measured"},
    "feasibility": {"name": "Feasibility", "weight": 0.10, "type": "AI Qualitative"},
    "dataset_feasibility": {"name": "Dataset Feasibility", "weight": 0.07, "type": "Measured"},
    "technology_feasibility": {"name": "Technology Feasibility", "weight": 0.07, "type": "Measured"},
    "time_feasibility": {"name": "Time Feasibility", "weight": 0.07, "type": "AI Qualitative"},
    "security": {"name": "Security", "weight": 0.07, "type": "Measured"},
    "scalability": {"name": "Scalability", "weight": 0.05, "type": "Measured"},
    "testing_evaluation": {"name": "Testing & Evaluation", "weight": 0.07, "type": "Measured"},
    "industry_relevance": {"name": "Industry Relevance", "weight": 0.06, "type": "AI Qualitative"},
    "documentation_readiness": {"name": "Documentation Readiness", "weight": 0.04, "type": "Measured"},
    "innovation": {"name": "Innovation", "weight": 0.04, "type": "AI Qualitative"}
}

def classify_survival_score(score: float) -> str:
    if score >= 90:
        return "Final-Ready (Excellent)"
    elif score >= 80:
        return "Strong"
    elif score >= 70:
        return "Good (Needs Minor Refinement)"
    elif score >= 60:
        return "Risky"
    elif score >= 40:
        return "Weak"
    else:
        return "High Risk"

class SurvivalScoringEngine:
    def calculate_survival_score(self, raw_scores: Dict[str, float], static_metrics: Dict[str, Any] = None) -> Dict[str, Any]:
        dimensions = []
        weighted_sum = 0.0
        total_weight = 0.0

        for key, meta in DEFAULT_DIMENSION_WEIGHTS.items():
            base_val = raw_scores.get(key, 82.0)

            # Adjust measured dimensions if static analysis metrics are available
            if static_metrics and meta["type"] == "Measured":
                if key == "security" and "static_analysis_flaws" in static_metrics:
                    flaws = static_metrics["static_analysis_flaws"]
                    base_val = max(40.0, 95.0 - (flaws * 8.0))
                elif key == "testing_evaluation" and "has_automated_tests" in static_metrics:
                    base_val = 88.0 if static_metrics["has_automated_tests"] else 45.0
                elif key == "technical_complexity" and "total_lines_analyzed" in static_metrics:
                    lines = static_metrics["total_lines_analyzed"]
                    base_val = min(96.0, 70.0 + (lines / 100.0))

            weight = meta["weight"]
            weighted_sum += base_val * weight
            total_weight += weight

            strong_msg = self._generate_strength_explanation(key, base_val)
            weak_msg = self._generate_weakness_explanation(key, base_val)

            dimensions.append({
                "key": key,
                "name": meta["name"],
                "score": round(base_val, 1),
                "weight": weight,
                "measured_type": meta["type"],
                "strong_because": strong_msg,
                "weakness_note": weak_msg
            })

        overall_score = round(weighted_sum / total_weight, 1) if total_weight > 0 else 80.0
        classification = classify_survival_score(overall_score)

        return {
            "overall_score": overall_score,
            "classification": classification,
            "dimensions": dimensions
        }

    def _generate_strength_explanation(self, key: str, score: float) -> str:
        strengths_map = {
            "problem_validity": "Real clinical/industry pain point with clear end-user demand.",
            "originality": "Unique integration of Grad-CAM explainability with automated medical triaging.",
            "research_depth": "Grounded in peer-reviewed JAMA & IEEE literature on deep learning.",
            "technical_complexity": "Multi-tier microservice architecture combining PyTorch inference with FastAPI and React.",
            "feasibility": "Scope is well-bounded for 4-month development by 3 team members.",
            "dataset_feasibility": "Utilizes benchmark APTOS 2019 dataset with 3,662 labeled fundus images.",
            "technology_feasibility": "Modern standard stack (Python, PyTorch, React, PostgreSQL).",
            "time_feasibility": "Tasks broken down cleanly across 10 structured roadmap phases.",
            "security": "SHA-256 password hashing and parameterized SQL query protection.",
            "scalability": "Decoupled REST API architecture allows horizontal container scaling.",
            "testing_evaluation": "Quantitative validation metrics (Accuracy, Quadratic Weighted Kappa).",
            "industry_relevance": "Direct applicability in primary care and telemedicine triage.",
            "documentation_readiness": "Detailed system blueprint, OpenAPI specs, and technical drafts.",
            "innovation": "Combines predictive neural classification with spatial visual heatmaps."
        }
        return strengths_map.get(key, "Demonstrates strong academic compliance.")

    def _generate_weakness_explanation(self, key: str, score: float) -> str:
        if score >= 85:
            return "No critical weaknesses identified in this dimension."
        weakness_map = {
            "security": "Lacks token expiration timestamp validation in JWT header authorization.",
            "testing_evaluation": "Missing automated integration test suite in tests/ directory.",
            "scalability": "Inference endpoint runs synchronously on main thread instead of worker queue.",
            "time_feasibility": "Model training phase could exceed timeline if GPU resources bottleneck."
        }
        return weakness_map.get(key, "Minor improvement opportunity before final evaluation.")

scoring_engine = SurvivalScoringEngine()
