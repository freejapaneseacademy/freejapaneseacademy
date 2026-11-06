import { describe, expect, it } from 'vitest';
import { scoreCheckpoint } from '../../src/components/interactive/MYRWCheckpoint';
import bank from '../../src/content/exercises/l0-m02-c03-chk.json';
describe('M/Y/R/W checkpoint', () => {
 it('has twelve distinct stable items with answer evidence and rationales', () => {
   expect(bank.items).toHaveLength(12);
   expect(new Set(bank.items.map(q => q.id)).size).toBe(12);
   for (const q of bank.items) {
     expect(q.id).toMatch(/^ex-l0-m02-c03-chk-\d{3}$/);
     expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
     expect(q.choices.every(c => c.rationale.length > 8)).toBe(true);
     expect(q.evidence.length).toBeGreaterThan(0); // A single kana such as ま is sufficient written evidence.
   }
 });
 it('scores fully correct and blank attempts', () => {
   expect(scoreCheckpoint(bank.items, Object.fromEntries(bank.items.map(q => [q.id,q.answerKey.choiceId])))).toBe(12);
   expect(scoreCheckpoint(bank.items, {})).toBe(0);
 });
});
