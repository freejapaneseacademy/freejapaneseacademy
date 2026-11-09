import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c04-l04-v1.json';
describe('loanword script bank', () => {
 it('has ten unique schema-keyed questions with explanations', () => {
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c04-l04-/);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(q.choices.map(c=>c.text)).toEqual(q.options);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
});