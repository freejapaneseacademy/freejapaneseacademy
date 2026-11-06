import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/l0-m02-c04-l04-v1.json';
describe('L04 kana typing bank',()=>{it('has ten unique correct, evidenced kana labels',()=>{
 expect(bank.items).toHaveLength(10);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.answer).toMatch(/^[ぁ-ん]+$/u);expect(q.answerKey.accepted).toContain(q.answer);expect(q.acceptedAnswers).toContain(q.answer);expect(q.evidence.phrase).toBe(q.answer);expect(q.explanation.length).toBeGreaterThan(25);}
});});