import { describe, expect, it } from 'vitest';
import { smallTsuShadowQuestions, scoreSmallTsuShadowKnowledge } from '../../src/components/interactive/SmallTsuShadowing';
describe('small tsu optional shadowing knowledge', () => {
 it('has six distinct answerable items with rationales', () => {
  expect(smallTsuShadowQuestions).toHaveLength(6);
  expect(new Set(smallTsuShadowQuestions.map(q=>q.id)).size).toBe(6);
  for (const q of smallTsuShadowQuestions) { expect(q.choices).toHaveLength(3); expect(q.why.length).toBeGreaterThan(25); expect(q.correct).toBeGreaterThanOrEqual(0); expect(q.correct).toBeLessThan(3); }
 });
 it('scores all-correct and blank attempts without counting speaking',()=>{
  expect(scoreSmallTsuShadowKnowledge(Object.fromEntries(smallTsuShadowQuestions.map(q=>[q.id,q.correct])))).toBe(6);
  expect(scoreSmallTsuShadowKnowledge({})).toBe(0);
 });
});