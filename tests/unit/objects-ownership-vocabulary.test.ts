import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c01-l02-v1.json';
describe('n5-m02-c01-l02 bank',()=>{
 it('has eight distinct, keyed, explained questions',()=>{
 expect(bank.items).toHaveLength(8);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(10);expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);}
 });
 it('has unique choice texts and distinct correct meanings',()=>{
 for(const q of bank.items)expect(new Set(q.choices.map(c=>c.text)).size).toBe(q.choices.length);
 expect(new Set(bank.items.map(q=>q.choices.find(c=>c.id===q.answerKey.choiceId)?.text)).size).toBe(8);
 });
});