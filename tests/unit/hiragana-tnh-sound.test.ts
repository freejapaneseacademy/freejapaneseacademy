import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c02-l03-v1.json';
describe('T/N/H sound exceptions',()=>{
 it('has eight unique, evidence-supported written questions with consistent keys',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.options).toHaveLength(3);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.explanation.length).toBeGreaterThan(20);
   expect(q.evidence.phrase.length).toBeGreaterThan(0);
   expect(q.skill).toBe('written');
  }
 });
});