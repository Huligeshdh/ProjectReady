import pytest
from app.analysis.scoring import calculate_overall_score, calculate_overall_from_criteria_dict

def test_calculate_overall_score_arithmetic_mean():
    """Verify that overall score equals exact arithmetic mean of 6 criteria."""
    # (84 + 81 + 80 + 16 + 95 + 93) / 6 = 74.8333... -> 74.83
    score = calculate_overall_score(84, 81, 80, 16, 95, 93)
    assert score == 74.83

def test_calculate_overall_score_all_equal():
    """Verify that equal scores produce exact same overall score."""
    score = calculate_overall_score(80, 80, 80, 80, 80, 80)
    assert score == 80.0

def test_calculate_overall_score_boundary():
    """Verify max 100 score."""
    score = calculate_overall_score(100, 100, 100, 100, 100, 100)
    assert score == 100.0

def test_calculate_overall_from_criteria_dict():
    """Verify dict parsing with scores nested in dict objects."""
    criteria = {
        "code_quality": {"score": 84},
        "security": {"score": 81},
        "efficiency": {"score": 80},
        "testing": {"score": 16},
        "accessibility": {"score": 95},
        "problem_alignment": {"score": 93}
    }
    score = calculate_overall_from_criteria_dict(criteria)
    assert score == 74.83
