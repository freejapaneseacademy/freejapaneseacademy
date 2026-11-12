import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c01-l01-v1.json';
import { likesContextQuestions,scoreLikesContext,LIKES_CONTEXT_QUIZ_ID } from '../../src/components/interactive/LikesContextPractice';
describe('likes and strengths context bank',()=>{
 it('has twelve distinct questions and valid answer keys',()=>{
  expect(LIKES_CONTEXT_QUIZ_ID).toBe('n5-m07-c01-l01-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-n5-m07-c01-l01-\d{2}$/);
   expect(q.status).toBe('drafted');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(12);
  }
 });
 it('scores correct, incorrect, and missing selections',()=>{
  expect(scoreLikesContext(Object.fromEntries(likesContextQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreLikesContext({})).toBe(0);
  expect(scoreLikesContext(Object.fromEntries(likesContextQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});