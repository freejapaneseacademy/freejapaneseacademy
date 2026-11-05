import { describe, it, expect } from 'vitest';
import { shadowQuestions, scoreShadowKnowledge } from '../../src/components/interactive/HiraganaShadowing';
describe('L0-M02-C01-L08 speaking preparation', () => {
  it('has five stable distinct questions with valid keys and rationales', () => {
    expect(shadowQuestions).toHaveLength(5);
    expect(new Set(shadowQuestions.map(q => q.id)).size).toBe(5);
    for (const q of shadowQuestions) { expect(q.id).toMatch(/^ex-l0-m02-c01-l08-00[1-5]$/); expect(q.choices[q.correct]).toBeTruthy(); expect(q.why.length).toBeGreaterThan(20); }
  });
  it('scores correct and incorrect written preparation without speech inference', () => {
    expect(scoreShadowKnowledge(Object.fromEntries(shadowQuestions.map(q => [q.id, q.correct])))).toBe(5);
    expect(scoreShadowKnowledge({})).toBe(0);
  });
});
