"""
Competition AI Code Submission Scoring Module.

Calculates the overall AI Code Submission Evaluation Score strictly as the
unweighted arithmetic mean of the six official competition criteria:
1. Code Quality
2. Security
3. Efficiency
4. Testing
5. Accessibility
6. Problem Statement Alignment

Formula:
  overall_score = (code_quality + security + efficiency + testing + accessibility + problem_alignment) / 6.0
Rounded to 2 decimal places.
"""

from typing import Dict, Any, Union

EQUAL_WEIGHT = 0.16666666666666666  # 1/6th = ~16.67% each


def calculate_overall_score(
    code_quality: float,
    security: float,
    efficiency: float,
    testing: float,
    accessibility: float,
    problem_alignment: float
) -> float:
    """Calculate overall AI submission score as average of 6 criteria rounded to 2 decimal places."""
    scores = [code_quality, security, efficiency, testing, accessibility, problem_alignment]
    for idx, s in enumerate(scores):
        if s is None or not isinstance(s, (int, float)):
            raise ValueError(f"Missing or invalid criterion score at index {idx}: {s}")
        if isinstance(s, float) and (s != s):  # NaN check
            raise ValueError(f"Criterion score cannot be NaN at index {idx}")
        if s < 0 or s > 100:
            raise ValueError(f"Criterion score must be between 0 and 100, got: {s}")

    avg = sum(scores) / 6.0
    return round(avg, 2)


def calculate_overall_from_criteria_dict(criteria: Dict[str, Any]) -> float:
    """Extract 6 criteria scores from dictionary and compute exact arithmetic mean."""
    if not isinstance(criteria, dict):
        raise ValueError("Criteria must be a dictionary.")

    required_keys = [
        "code_quality",
        "security",
        "efficiency",
        "testing",
        "accessibility",
        "problem_alignment"
    ]

    extracted_scores = []
    for key in required_keys:
        val = criteria.get(key)
        if val is None and key == "problem_alignment":
            val = criteria.get("problem_statement_alignment")

        if val is None:
            raise ValueError(f"Missing required evaluation criterion: '{key}'")

        score_val = val.get("score") if isinstance(val, dict) else val
        if score_val is None or not isinstance(score_val, (int, float)):
            raise ValueError(f"Missing or invalid score value for criterion '{key}': {score_val}")

        extracted_scores.append(float(score_val))

    return calculate_overall_score(*extracted_scores)
