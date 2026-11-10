import { describe, it, expect } from 'vitest';
import { yoonShadowQuestions, scoreYoonShadowKnowledge } from '../src/components/interactive/YoonKanaShadowing';
describe('L0-M03-C02-L08 optional shadowing knowledge', () => {
 it('has six unique stable scored questions with rationales', () => {
  expect(yoonShadowQuestions).toHaveLength(6);
  expect(new Set(yoonShadowQuestions.map(q=>q.id)).size).toBe(6);
  for(const q of yoonShadowQuestions){expect(q.id).toMatch(/^ex-l0-m03-c02-l08-00[1-6]$/);expect(q.choices.length).toBeGreaterThanOrEqual(3);expect(q.why.length).toBeGreaterThan(35);expect(q.correct).toBeGreaterThanOrEqual(0);expect(q.correct).toBeLessThan(q.choices.length);}
 });
 it('scores the complete and incorrect response sets', () => {
  expect(scoreYoonShadowKnowledge(Object.fromEntries(yoonShadowQuestions.map(q=>[q.id,q.correct])))).toBe(6);
  expect(scoreYoonShadowKnowledge({})).toBe(0);
 });
});