import { describe,it,expect } from 'vitest';
import bank from '../src/content/exercises/l0-m04-c02-l08-v1.json';
import { writtenScore } from '../src/components/interactive/KatakanaNhmyShadowing';
describe('Chapter 02 optional shadowing written check',()=>{
 it('has eight unique versioned schema-compliant questions with meaningful rationales',()=>{
   expect(bank.items).toHaveLength(8);
   expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
   for(const q of bank.items){expect(q.id).toMatch(/^ex-l0-m04-c02-l08-/);expect(q.version).toBe(1);expect(q.status).toBe('drafted');expect(q.choices.length).toBeGreaterThan(2);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('scores only written recognition, not spoken self-reports',()=>{
   const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
   expect(writtenScore(correct)).toBe(8);
   expect(writtenScore({})).toBe(0);
   expect(writtenScore({...correct,[bank.items[0].id]:'incorrect'})).toBe(7);
 });
});
