/**
 * Competition AI Code Submission Scoring Utility.
 *
 * Mathematically calculates the overall AI Evaluation Score as the unweighted
 * arithmetic mean of all 6 competition criteria:
 * 1. Code Quality
 * 2. Security
 * 3. Efficiency
 * 4. Testing
 * 5. Accessibility
 * 6. Problem Statement Alignment
 *
 * Formula:
 *   overallScore = (codeQuality + security + efficiency + testing + accessibility + problemAlignment) / 6
 * Rounded to 2 decimal places.
 */

export interface CriterionDetail {
  score: number;
  weight?: number;
  label?: string;
  evidence?: string;
  measured_type?: string;
}

export interface CriteriaMap {
  code_quality?: CriterionDetail | number;
  security?: CriterionDetail | number;
  efficiency?: CriterionDetail | number;
  testing?: CriterionDetail | number;
  accessibility?: CriterionDetail | number;
  problem_alignment?: CriterionDetail | number;
  problem_statement_alignment?: CriterionDetail | number;
  [key: string]: any;
}

export function calculateOverallScore(criteria?: CriteriaMap | null): number | null {
  if (!criteria || typeof criteria !== 'object') {
    return null;
  }

  const keys = [
    'code_quality',
    'security',
    'efficiency',
    'testing',
    'accessibility',
    'problem_alignment'
  ];

  const scores: number[] = [];

  for (const key of keys) {
    let item = criteria[key];
    if ((item === undefined || item === null) && key === 'problem_alignment') {
      item = criteria['problem_statement_alignment'];
    }

    if (item === undefined || item === null) {
      console.warn(`[Scoring] Missing criterion: '${key}'`);
      return null;
    }

    const val = typeof item === 'number' ? item : item.score;
    if (val === undefined || val === null || typeof val !== 'number' || Number.isNaN(val)) {
      console.warn(`[Scoring] Invalid score for criterion '${key}':`, val);
      return null;
    }

    if (val < 0 || val > 100) {
      console.warn(`[Scoring] Criterion score out of range (0-100) for '${key}':`, val);
      return null;
    }

    scores.push(val);
  }

  if (scores.length !== 6) {
    return null;
  }

  const sum = scores.reduce((acc, curr) => acc + curr, 0);
  const avg = sum / 6;
  return Math.round(avg * 100) / 100;
}
