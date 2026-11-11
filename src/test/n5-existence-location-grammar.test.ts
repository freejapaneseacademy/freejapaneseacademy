import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m02-c03-l03-v1.json';
import { scoreExistenceGrammar } from '../components/interactive/ExistenceGrammarPractice';
describe('n5-m02-c03-l03 existence and location',()=>{
 it('has twelve unique, explained, keyed questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(12);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);}
 });
 it('scores unanswered, correct and incorrect answers',()=>{
  expect(scoreExistenceGrammar({})).toBe(0);
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreExistenceGrammar(correct)).toBe(12);
  correct[bank.items[0].id]='wrong';
  expect(scoreExistenceGrammar(correct)).toBe(11);
 });
});