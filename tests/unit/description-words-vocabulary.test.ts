import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c03-l02-v1.json';
describe('n5-m04-c03-l02 vocabulary bank',()=>{
 it('contains twelve distinct, keyed and explained questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);
  }
 });
 it('rotates answer positions and keeps stable IDs',()=>{
  expect(new Set(bank.items.map(q=>q.answerKey.choiceId)).size).toBe(4);
  expect(bank.items.every(q=>q.id.startsWith('ex-n5-m04-c03-l02-v1-'))).toBe(true);
 });
});
