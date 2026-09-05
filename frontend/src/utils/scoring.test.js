import test from 'node:test';
import assert from 'node:assert/strict';

// Pure JS testing mirror of calculateOverallScore formula
export const calculateOverallScore = (
  codeQuality,
  security,
  efficiency,
  testing,
  accessibility,
  problemStatementAlignment
) => {
  const sum =
    Number(codeQuality || 0) +
    Number(security || 0) +
    Number(efficiency || 0) +
    Number(testing || 0) +
    Number(accessibility || 0) +
    Number(problemStatementAlignment || 0);

  return Math.round((sum / 6) * 100) / 100;
};

test('calculateOverallScore returns exact arithmetic mean rounded to 2 decimal places', () => {
  const score = calculateOverallScore(84, 81, 80, 16, 95, 93);
  assert.equal(score, 74.83);
});

test('calculateOverallScore handles string numbers cleanly', () => {
  const score = calculateOverallScore("84", "81", "80", "16", "95", "93");
  assert.equal(score, 74.83);
});

test('calculateOverallScore returns 100 for maximum criteria scores', () => {
  const score = calculateOverallScore(100, 100, 100, 100, 100, 100);
  assert.equal(score, 100.0);
});

test('calculateOverallScore handles 60 across all criteria', () => {
  const score = calculateOverallScore(60, 60, 60, 60, 60, 60);
  assert.equal(score, 60.0);
});
