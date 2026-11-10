import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c02-l04-v1.json';
describe('registration kana bank',()=>{
 it('has twelve unique keyed and explained written items',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-l0-m05-c02-l04-/);
   expect(q.version).toBe(1);expect(q.status).toBe('drafted');
   expect(q.choices.map(c=>c.text)).toEqual(q.options);
   expect(q.options[q.correctIndex]).toBe(q.choices.find(c=>c.id===q.answerKey.choiceId)?.text);
   expect(new Set(q.options).size).toBe(3);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
   expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.knowledgeItemIds.length).toBeGreaterThan(0);
  }
 });
});