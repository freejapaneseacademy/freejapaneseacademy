import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c01-l03-v1.json';
import {likesGrammarQuestions,scoreLikesGrammar,LIKES_GRAMMAR_QUIZ_ID} from '../../src/components/interactive/LikesGrammarPractice';
describe('likes and strengths grammar bank',()=>{
 it('contains twelve uniquely keyed questions and explained distractors',()=>{
  expect(LIKES_GRAMMAR_QUIZ_ID).toBe('n5-m07-c01-l03-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m07-c01-l03-\d{2}$/);expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.evidence.length).toBeGreaterThan(4);}
 });
 it('scores correct, incorrect and missing answers',()=>{
  expect(scoreLikesGrammar(Object.fromEntries(likesGrammarQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreLikesGrammar({})).toBe(0);
  expect(scoreLikesGrammar(Object.fromEntries(likesGrammarQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});
