import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c02-l02-v1.json';
describe('T/N/H word cards',()=>{
 it('has ten stable keyed evidence-supported written items',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.options).toHaveLength(3);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.evidence.phrase.length).toBeGreaterThan(0);
   expect(q.skill).toBe('written');
  }
 });
});
