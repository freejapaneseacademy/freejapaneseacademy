import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c01-l01-v1.json';
import {scoreMovementContext} from '../../src/components/interactive/MovementContextPractice';
describe('n5-m05-c01-l01 movement context',()=>{
 it('has ten unique questions with keyed, reasoned choices',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(4);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(4);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
  }
 });
 it('scores keyed IDs rather than displayed text',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreMovementContext(correct)).toBe(10);
  expect(scoreMovementContext({})).toBe(0);
  const first=bank.items[0];
  expect(scoreMovementContext({...correct,[first.id]:first.choices.find(c=>c.id!==first.answerKey.choiceId)!.id})).toBe(9);
 });
});