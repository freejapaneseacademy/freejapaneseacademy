import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c03-l07-v1.json';
import { gradeTwoDayWriting } from '../../src/components/interactive/TwoDayWritingWorkshop';
describe('n5-m03-c03-l07 writing recognition',()=>{
 it('contains eight uniquely keyed, explained questions',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
   expect(q.explanation.length).toBeGreaterThan(15);
  }
 });
 it('grades exact keyed choices, not ungraded free prose',()=>{
  expect(gradeTwoDayWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);
  expect(gradeTwoDayWriting({})).toBe(0);
  expect(gradeTwoDayWriting(Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});