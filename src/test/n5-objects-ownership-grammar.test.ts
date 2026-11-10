import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m02-c01-l03-v1.json';
import { scoreObjectGrammar } from '../components/interactive/ObjectOwnershipGrammarPractice';
describe('n5-m02-c01-l03 object ownership grammar',()=>{
 it('has twelve unique, keyed and explained questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items) {expect(q.choices).toHaveLength(4);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(12);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);}
 });
 it('scores blank, all correct and one wrong',()=>{
  expect(scoreObjectGrammar({})).toBe(0);
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreObjectGrammar(correct)).toBe(12);
  correct[bank.items[0].id]='incorrect';
  expect(scoreObjectGrammar(correct)).toBe(11);
 });
});