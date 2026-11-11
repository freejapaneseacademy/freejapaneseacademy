import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m06-c02-chk-v1.json';
import { scoreTeFormCheckpoint } from '../components/interactive/TeFormChapterCheckpoint';
describe('N5-M06-C02-CHK written checkpoint', () => {
 it('has sixteen unique structurally valid questions with meaningful feedback', () => {
  expect(bank.items).toHaveLength(16);
  expect(new Set(bank.items.map(q => q.id)).size).toBe(16);
  for (const q of bank.items) {
   expect(q.id.startsWith('ex-n5-m06-c02-chk-')).toBe(true);
   expect(new Set(q.choices.map(c => c.id)).size).toBe(3);
   expect(new Set(q.choices.map(c => c.text)).size).toBe(3);
   expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c => c.rationale.length > 12)).toBe(true);
  }
 });
 it('scores correct, incorrect and empty attempts', () => {
  const all = Object.fromEntries(bank.items.map(q => [q.id,q.answerKey.choiceId]));
  expect(scoreTeFormCheckpoint(all)).toBe(16);
  expect(scoreTeFormCheckpoint({})).toBe(0);
  const first = bank.items[0];
  expect(scoreTeFormCheckpoint({...all,[first.id]:first.choices.find(c => c.id !== first.answerKey.choiceId)!.id})).toBe(15);
 });
});