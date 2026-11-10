import { describe, it, expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c01-l01-v1.json';
describe('N5 first meeting context', () => {
 it('has eight distinct evidence-based questions', () => {
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(8);
  for (const q of bank.items) {
   expect(q.type).toBe('single-choice');
   expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
   expect(new Set(q.choices.map(c => c.text)).size).toBe(q.choices.length);
   expect(q.choices.every(c => c.rationale.length > 10)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('has varied answer positions and nonofficial scoring', () => {
  expect(new Set(bank.items.map(q => q.choices.findIndex(c => c.id === q.answerKey.choiceId))).size).toBe(3);
  expect(bank.scoring.officialJLPTScore).toBe(false);
 });
});
