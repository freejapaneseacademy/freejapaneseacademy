import { describe, expect, it } from 'vitest';
import { shadowQuestions, scoreShadowKnowledge } from '../../src/components/interactive/MYRWShadowing';

describe('M/Y/R/W optional speaking knowledge check', () => {
  it('uses six unique stable question IDs and one valid answer each', () => {
    expect(shadowQuestions).toHaveLength(6);
    expect(new Set(shadowQuestions.map(q => q.id)).size).toBe(6);
    for (const q of shadowQuestions) {
      expect(q.id).toMatch(/^ex-l0-m02-c03-l08-\d{3}$/);
      expect(q.choices[q.correct]).toBeTruthy();
      expect(q.why.length).toBeGreaterThan(20);
    }
  });
  it('scores correct and incorrect answers without measuring speech', () => {
    expect(scoreShadowKnowledge(Object.fromEntries(shadowQuestions.map(q => [q.id, q.correct])))).toBe(6);
    expect(scoreShadowKnowledge({})).toBe(0);
  });
});
