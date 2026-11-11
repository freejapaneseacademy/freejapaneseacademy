import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c04-l02-v1.json';
import { gradePersonalProfileWords } from '../../src/components/interactive/PersonalProfileWordsPractice';
describe('N5 personal profile vocabulary',()=>{
 it('has ten unique answerable questions and explanations',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.every(c=>Boolean(c.rationale))).toBe(true);expect(q.explanation.length).toBeGreaterThan(10);}
 });
 it('grades complete and partial selections',()=>{
  const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradePersonalProfileWords(correct)).toBe(10);
  expect(gradePersonalProfileWords({})).toBe(0);
  expect(gradePersonalProfileWords({...correct,[bank.items[0].id]:'invalid'})).toBe(9);
 });
});
