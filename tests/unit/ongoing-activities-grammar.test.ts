import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c04-l03-v1.json';
import {ongoingGrammarQuestions,scoreOngoingGrammar,ONGOING_GRAMMAR_QUIZ_ID} from '../../src/components/interactive/OngoingGrammarPractice';
describe('ongoing activities grammar bank',()=>{
 it('has twelve unique keyed questions and distinct explained alternatives',()=>{
  expect(ONGOING_GRAMMAR_QUIZ_ID).toBe('n5-m06-c04-l03-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){
   expect(q.id).toMatch(/^ex-n5-m06-c04-l03-\d{2}$/);
   expect(q.status).toBe('drafted');
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
   expect(q.evidence.length).toBeGreaterThan(4);
  }
 });
 it('scores complete correct, wrong and missing responses',()=>{
  expect(scoreOngoingGrammar(Object.fromEntries(ongoingGrammarQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreOngoingGrammar({})).toBe(0);
  expect(scoreOngoingGrammar(Object.fromEntries(ongoingGrammarQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});
