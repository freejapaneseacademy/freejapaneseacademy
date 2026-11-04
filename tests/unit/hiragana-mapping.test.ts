import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c01-l03-v1.json';
describe('Hiragana I character-to-sound mapping',()=>{
 it('has eight unique, keyed, evidenced written questions',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.options).toHaveLength(3);
   expect(q.answerKey.choiceId).toBe(q.choices[q.correctIndex].id);
   expect(q.explanation.length).toBeGreaterThan(15);
   expect(q.evidence.phrase.length).toBeGreaterThan(0);
   expect(q.skill).toBe('written');
  }
 });
});