import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l04-v1.json';
import { gradeSentenceScript } from '../../src/components/interactive/FirstSentenceScriptPractice';
describe('first sentence script bank', () => {
 it('has twelve unique questions with valid answer keys and rationales', () => {
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for (const q of bank.items) {
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('scores by stable choice ids', () => {
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeSentenceScript(correct)).toBe(12);
  expect(gradeSentenceScript({})).toBe(0);
 });
});