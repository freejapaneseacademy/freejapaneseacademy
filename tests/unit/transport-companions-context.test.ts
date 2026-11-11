import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c02-l01-v1.json';
import {scoreCompanionContext} from '../../src/components/interactive/CompanionContextPractice';
describe('n5-m05-c02-l01 transport companions context',()=>{
 it('has ten unique, valid keyed questions and meaningful feedback',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>25)).toBe(true);
  }
 });
 it('scores keyed choice IDs',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreCompanionContext(correct)).toBe(10);
  expect(scoreCompanionContext({})).toBe(0);
  const first=bank.items[0];
  expect(scoreCompanionContext({...correct,[first.id]:first.choices.find(c=>c.id!==first.answerKey.choiceId)!.id})).toBe(9);
 });
});