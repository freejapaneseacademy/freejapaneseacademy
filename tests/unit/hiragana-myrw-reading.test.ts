import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c03-l05-v1.json';
describe('M/Y/R/W original reading bank',()=>{
 it('contains twelve unique stable scored items with grounded evidence',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.options).toHaveLength(4);
   expect(q.options[q.correctIndex]).toBe(q.answer);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.evidence.phrase.length).toBeGreaterThan(1);
   expect(q.explanation).toContain(q.evidence.phrase);
  }
 });
 it('tests ten card details and both written notices',()=>{
  expect(bank.items.slice(0,10)).toHaveLength(10);
  expect(bank.items[10].evidence.phrase).toBe('ほんをよむ。');
  expect(bank.items[11].evidence.phrase).toBe('みかんをみる。');
 });
});
