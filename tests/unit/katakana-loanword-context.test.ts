import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c04-l01-v1.json';
describe('katakana loanword context bank',()=>{
 it('has ten distinct versioned single-choice items with keyed rationales',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-l0-m04-c04-l01-/);
   expect(q.version).toBe(1); expect(q.status).toBe('drafted');
   expect(q.choices.length).toBeGreaterThanOrEqual(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
   expect(q.objectiveIds.length).toBeGreaterThan(0);
  }
 });
 it('tests the context and the exact borrowed spellings',()=>{
  expect(bank.items[2].choices.find(c=>c.id===bank.items[2].answerKey.choiceId)?.text).toContain('ティー');
  expect(bank.items[6].choices.find(c=>c.id===bank.items[6].answerKey.choiceId)?.text).toBe('ティ');
  expect(bank.items[8].choices.find(c=>c.id===bank.items[8].answerKey.choiceId)?.text).toBe('チェリー');
 });
});