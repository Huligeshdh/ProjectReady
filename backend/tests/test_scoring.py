import pytest
import math
from app.analysis.scoring import calculate_overall_score, calculate_overall_from_criteria_dict


def test_scoring_prompt_example():
    """Verify 84, 81, 80, 16, 95, 93 = 74.83"""
    score = calculate_overall_score(84, 81, 80, 16, 95, 93)
    assert math.isclose(score, 74.83, abs_tol=0.001)


def test_scoring_perfect_hundred():
    """Verify 100, 100, 100, 100, 100, 100 = 100"""
    score = calculate_overall_score(100, 100, 100, 100, 100, 100)
    assert score == 100.0


def test_scoring_all_zeros():
    """Verify 0, 0, 0, 0, 0, 0 = 0"""
    score = calculate_overall_score(0, 0, 0, 0, 0, 0)
    assert score == 0.0


def test_scoring_all_eighties():
    """Verify 80, 80, 80, 80, 80, 80 = 80"""
    score = calculate_overall_score(80, 80, 80, 80, 80, 80)
    assert score == 80.0


def test_scoring_dict_input():
    """Verify dictionary parsing with equal weights."""
    criteria = {
        "code_quality": {"score": 84},
        "security": {"score": 81},
        "efficiency": {"score": 80},
        "testing": {"score": 16},
        "accessibility": {"score": 95},
        "problem_alignment": {"score": 93}
    }
    score = calculate_overall_from_criteria_dict(criteria)
    assert math.isclose(score, 74.83, abs_tol=0.001)


def test_scoring_missing_criterion_raises_error():
    """Verify missing criterion raises ValueError."""
    criteria_missing = {
        "code_quality": {"score": 84},
        "security": {"score": 81},
        "efficiency": {"score": 80},
        "testing": {"score": 16},
        "accessibility": {"score": 95}
        # missing problem_alignment
    }
    with pytest.raises(ValueError) as exc_info:
        calculate_overall_from_criteria_dict(criteria_missing)
    assert "Missing required evaluation criterion" in str(exc_info.value)


def test_scoring_invalid_none_score_raises_error():
    """Verify None score raises ValueError."""
    with pytest.raises(ValueError):
        calculate_overall_score(84, None, 80, 16, 95, 93)
