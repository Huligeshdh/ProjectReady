import assert from 'node:assert/strict';
import { test } from 'node:test';
import { calculateOverallScore } from './scoring.ts';

test('Prompt test case: 84, 81, 80, 16, 95, 93 -> 74.83', () => {
  const criteria = {
    code_quality: { score: 84 },
    security: { score: 81 },
    efficiency: { score: 80 },
    testing: { score: 16 },
    accessibility: { score: 95 },
    problem_alignment: { score: 93 }
  };
  const result = calculateOverallScore(criteria);
  assert.strictEqual(result, 74.83);
});

test('Test case: 100, 100, 100, 100, 100, 100 -> 100', () => {
  const criteria = {
    code_quality: 100,
    security: 100,
    efficiency: 100,
    testing: 100,
    accessibility: 100,
    problem_alignment: 100
  };
  const result = calculateOverallScore(criteria);
  assert.strictEqual(result, 100);
});

test('Test case: 0, 0, 0, 0, 0, 0 -> 0', () => {
  const criteria = {
    code_quality: 0,
    security: 0,
    efficiency: 0,
    testing: 0,
    accessibility: 0,
    problem_alignment: 0
  };
  const result = calculateOverallScore(criteria);
  assert.strictEqual(result, 0);
});

test('Test case: 80, 80, 80, 80, 80, 80 -> 80', () => {
  const criteria = {
    code_quality: 80,
    security: 80,
    efficiency: 80,
    testing: 80,
    accessibility: 80,
    problem_alignment: 80
  };
  const result = calculateOverallScore(criteria);
  assert.strictEqual(result, 80);
});

test('Missing criterion handling -> returns null', () => {
  const criteria = {
    code_quality: 84,
    security: 81,
    efficiency: 80,
    testing: 16,
    accessibility: 95
  };
  const result = calculateOverallScore(criteria);
  assert.strictEqual(result, null);
});
