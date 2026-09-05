/**
 * AI Evaluation Scoring Utility Module
 * Implements exact arithmetic mean calculation (16.6667% equal weighting per criterion)
 * for the 6 PromptWars Competition Evaluation Criteria:
 * 1. Code Quality
 * 2. Security
 * 3. Efficiency
 * 4. Testing
 * 5. Accessibility
 * 6. Problem Statement Alignment
 */

export interface CriteriaInput {
  codeQuality?: number;
  security?: number;
  efficiency?: number;
  testing?: number;
  accessibility?: number;
  problemStatementAlignment?: number;
  [key: string]: any;
}

export const calculateOverallScore = (
  codeQuality: number | string = 0,
  security: number | string = 0,
  efficiency: number | string = 0,
  testing: number | string = 0,
  accessibility: number | string = 0,
  problemStatementAlignment: number | string = 0
): number => {
  const sum =
    Number(codeQuality || 0) +
    Number(security || 0) +
    Number(efficiency || 0) +
    Number(testing || 0) +
    Number(accessibility || 0) +
    Number(problemStatementAlignment || 0);

  // Equal weighting: exact arithmetic average of 6 criteria
  return Math.round((sum / 6) * 100) / 100;
};

export const calculateOverallFromCriteriaObj = (criteriaObj: any): number => {
  if (!criteriaObj) return 0;
  const cq = criteriaObj.code_quality?.score ?? criteriaObj.codeQuality ?? 0;
  const sec = criteriaObj.security?.score ?? criteriaObj.security ?? 0;
  const eff = criteriaObj.efficiency?.score ?? criteriaObj.efficiency ?? 0;
  const tst = criteriaObj.testing?.score ?? criteriaObj.testing ?? 0;
  const a11y = criteriaObj.accessibility?.score ?? criteriaObj.accessibility ?? 0;
  const psa = criteriaObj.problem_alignment?.score ?? criteriaObj.problemStatementAlignment ?? 0;

  return calculateOverallScore(cq, sec, eff, tst, a11y, psa);
};
