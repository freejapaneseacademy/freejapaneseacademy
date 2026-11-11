import { describe,it,expect } from 'vitest';
import bank from '../content/exercises/n5-m01-c02-chk-v1.json';
describe('N5 question-words checkpoint',()=>{
 it('has fourteen uniquely keyed questions in grammar, reading and listening',()=>{
   expect(bank.items).toHaveLength(14);
   expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);
   expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4);
   expect(bank.items.filter(q=>q.skills[0]==='reading')).toHaveLength(4);
   expect(bank.items.filter(q=>q.skills[0]==='grammar')).toHaveLength(6);
 });
 it('each question has a valid unique answer and grounded feedback',()=>{
   for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation.length).toBeGreaterThan(12);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
});
