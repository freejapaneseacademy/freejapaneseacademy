import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/l0-m04-c04-l02-v1.json';
describe('katakana loanword vocabulary bank',()=>{
 it('has ten distinct versioned schema-aligned keyed items',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-l0-m04-c04-l02-/);
   expect(q.version).toBe(1); expect(q.status).toBe('drafted');
   expect(q.choices.length).toBe(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
   expect(q.objectiveIds.length).toBeGreaterThan(0);
   expect(q.knowledgeItemIds.length).toBeGreaterThan(0);
  }
 });
 it('distinguishes menu, file and platform meanings',()=>{
  expect(bank.items[0].choices.find(c=>c.id===bank.items[0].answerKey.choiceId)?.text).toBe('コーヒー');
  expect(bank.items[3].choices.find(c=>c.id===bank.items[3].answerKey.choiceId)?.text).toBe('ファイル');
  expect(bank.items[8].choices.find(c=>c.id===bank.items[8].answerKey.choiceId)?.text).toBe('Train platform');
 });
});