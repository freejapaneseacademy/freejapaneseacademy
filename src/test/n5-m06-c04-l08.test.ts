import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m06-c04-l08-v1.json';
import { scoreActivityRoleplay } from '../components/interactive/ActivityRoleplay';
describe('n5-m06-c04-l08 activity roleplay', () => {
 it('has twelve unique, answerable questions with feedback', () => {
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.status).toBe('internally-checked');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
  }
 });
 it('scores correct, incorrect and empty answers',()=>{
  expect(scoreActivityRoleplay(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreActivityRoleplay(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  expect(scoreActivityRoleplay({})).toBe(0);
 });
});
