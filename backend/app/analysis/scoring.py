"""
AI Evaluation Scoring Utility Module
Implements equal weighting (16.6667% per criterion) for the 6 PromptWars Competition Criteria:
1. Code Quality
2. Security
3. Efficiency
4. Testing
5. Accessibility
6. Problem Statement Alignment

Formula:
  Overall Score = (code_quality + security + efficiency + testing + accessibility + problem_alignment) / 6
"""

from typing import Dict, Any, Union

def calculate_overall_score(
    code_quality: float,
    security: float,
    efficiency: float,
    testing: float,
    accessibility: float,
    problem_alignment: float
) -> float:
    """Calculates transparent overall score as exact arithmetic mean of 6 criteria."""
    total = (
        float(code_quality) +
        float(security) +
        float(efficiency) +
        float(testing) +
        float(accessibility) +
        float(problem_alignment)
    )
    return round(total / 6.0, 2)


def calculate_overall_from_criteria_dict(criteria: Dict[str, Any]) -> float:
    """Calculates overall score from a criteria dictionary containing the 6 keys."""
    cq = criteria.get("code_quality", {}).get("score", criteria.get("code_quality", 0))
    sec = criteria.get("security", {}).get("score", criteria.get("security", 0))
    eff = criteria.get("efficiency", {}).get("score", criteria.get("efficiency", 0))
    tst = criteria.get("testing", {}).get("score", criteria.get("testing", 0))
    a11y = criteria.get("accessibility", {}).get("score", criteria.get("accessibility", 0))
    psa = criteria.get("problem_alignment", {}).get("score", criteria.get("problem_alignment", 0))

    if isinstance(cq, dict): cq = cq.get("score", 0)
    if isinstance(sec, dict): sec = sec.get("score", 0)
    if isinstance(eff, dict): eff = eff.get("score", 0)
    if isinstance(tst, dict): tst = tst.get("score", 0)
    if isinstance(a11y, dict): a11y = a11y.get("score", 0)
    if isinstance(psa, dict): psa = psa.get("score", 0)

    return calculate_overall_score(cq, sec, eff, tst, a11y, psa)
