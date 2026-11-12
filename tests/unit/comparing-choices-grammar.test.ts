import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c03-l03-v1.json';
import {comparisonGrammarQuestions,scoreComparisonGrammar,COMPARISON_GRAMMAR_QUIZ_ID} from '../../src/components/interactive/ComparisonGrammarPractice';
describe('comparison grammar bank',()=>{
 it('contains twelve keyed unique questions with feedback',()=>{
  expect(COMPARISON_GRAMMAR_QUIZ_ID).toBe('n5-m07-c03-l03-v1');
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.status).toBe('drafted');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.evidence.length).toBeGreaterThan(4);}
 });
 it('scores correct, incorrect and unanswered',()=>{
  expect(scoreComparisonGrammar(Object.fromEntries(comparisonGrammarQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreComparisonGrammar({})).toBe(0);
  expect(scoreComparisonGrammar(Object.fromEntries(comparisonGrammarQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});
