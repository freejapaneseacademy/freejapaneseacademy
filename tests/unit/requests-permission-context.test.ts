import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c03-l01-v1.json';
import { requestContextQuestions,scoreRequestContext,REQUEST_CONTEXT_QUIZ_ID } from '../../src/components/interactive/RequestContextPractice';
describe('requests and permission context bank',()=>{
 it('has twelve unique canonical questions with valid keys and distinct choices',()=>{
  expect(REQUEST_CONTEXT_QUIZ_ID).toBe('n5-m06-c03-l01-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-n5-m06-c03-l01-\d{2}$/);
   expect(q.status).toBe('drafted');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(12);
  }
 });
 it('scores correct, wrong and missing answers',()=>{
  const right=Object.fromEntries(requestContextQuestions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreRequestContext(right)).toBe(12);
  expect(scoreRequestContext({})).toBe(0);
  const wrong=Object.fromEntries(requestContextQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreRequestContext(wrong)).toBe(0);
 });
});
