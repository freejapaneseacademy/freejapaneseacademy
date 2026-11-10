import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l01-v1.json';
describe('first sentence context exercise bank',()=>{
 it('has ten unique, structurally aligned keyed questions',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-l0-m05-c03-l01-/);
   expect(q.status).toBe('drafted');
   expect(q.choices.map(c=>c.text)).toEqual(q.options);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
   expect(q.objectiveIds.length).toBeGreaterThan(0);
  }
 });
 it('distinguishes questions and statements',()=>{
  expect(bank.items[2].options[bank.items[2].correctIndex]).toContain('asks');
  expect(bank.items[3].options[bank.items[3].correctIndex]).toContain('です。');
  expect(bank.items[5].options[bank.items[5].correctIndex]).toContain('topic');
 });
});
