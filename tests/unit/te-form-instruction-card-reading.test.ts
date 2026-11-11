import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l05-v1.json';
import { gradeInstructionCard } from '../../src/components/interactive/InstructionCardReadingPractice';
describe('n5-m06-c02-l05 reading bank',()=>{
 it('contains eight uniquely keyed questions with evidence and distinct answers',()=>{
  expect(bank.items).toHaveLength(8);
  expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
  for(const q of bank.items){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
   expect(q.evidence.length).toBeGreaterThan(8);
   expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
  }
 });
 it('grades perfect and incorrect attempts',()=>{
  const right=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(bank.items.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(gradeInstructionCard(right)).toBe(8);
  expect(gradeInstructionCard(wrong)).toBe(0);
 });
});