import { describe,it,expect } from 'vitest';
import bank from '../content/exercises/n5-m06-c03-l08-v1.json';
import { QUIZ_ID,questions,scoreRequestRoleplay } from '../components/interactive/RequestPermissionRoleplay';
describe('n5-m06-c03-l08 written preparation',()=>{
 it('uses eight unique schema-shaped questions and distinct choices',()=>{
  expect(QUIZ_ID).toBe('n5-m06-c03-l08-speaking-prep-v1');
  expect(questions).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-n5-m06-c03-l08-q\d\d-v1$/);
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
  }
 });
 it('scores only matching IDs and keys',()=>{
  expect(scoreRequestRoleplay({})).toBe(0);
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreRequestRoleplay(correct)).toBe(8);
  const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreRequestRoleplay(wrong)).toBe(0);
 });
});
