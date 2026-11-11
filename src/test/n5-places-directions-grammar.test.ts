import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m02-c02-l03-v1.json';
import { scorePlacesGrammar } from '../components/interactive/PlacesGrammarPractice';
describe('n5-m02-c02-l03 places and directions',()=>{
 it('has twelve unique and explained keyed questions',()=>{
  expect(bank.items).toHaveLength(12);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(12);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);}
 });
 it('scores unanswered, all correct and one incorrect',()=>{
  expect(scorePlacesGrammar({})).toBe(0);
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scorePlacesGrammar(correct)).toBe(12);
  correct[bank.items[0].id]='wrong';
  expect(scorePlacesGrammar(correct)).toBe(11);
 });
});