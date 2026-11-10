import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c01-l03-v1.json';
import { gradeFoodPreferences } from '../../src/components/interactive/FoodPreferencesPractice';
describe('n5-m04-c01-l03 exercise integrity',()=>{
 it('has ten distinct keyed questions and rationales',()=>{
  expect(bank.items).toHaveLength(10);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices[q.correctIndex].id).toBe(q.answerKey.choiceId);
   expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);
  }
 });
 it('grades exactly the keyed choices',()=>{
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeFoodPreferences(answers)).toBe(10);
  expect(gradeFoodPreferences({})).toBe(0);
 });
});
