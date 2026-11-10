import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/l0-m05-c04-l05-v1.json';
import { scoreFoundationStory } from '../components/interactive/FoundationStoryReadingPractice';
describe('l0-m05-c04-l05 original story bank',()=>{
 it('has ten uniquely keyed evidence questions',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(12);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}
 });
 it('scores correct, blank and incorrect selections',()=>{
  const full=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreFoundationStory(full)).toBe(10);
  expect(scoreFoundationStory({})).toBe(0);
  expect(scoreFoundationStory({...full,[bank.items[0].id]:'missing'})).toBe(9);
 });
});
