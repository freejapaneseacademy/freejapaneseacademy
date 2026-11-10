import { describe, it, expect } from 'vitest';
import bank from '../content/exercises/n5-m01-c01-chk-v1.json';
describe('N5 first meetings checkpoint',()=>{
 it('has fourteen uniquely keyed questions and valid answers',()=>{expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.evidence.length).toBeGreaterThan(2);expect(q.explanation.length).toBeGreaterThan(10)}});
 it('balances grammar, reading and listening',()=>{expect(bank.items.filter(q=>q.skills[0]==='grammar')).toHaveLength(6);expect(bank.items.filter(q=>q.skills[0]==='reading')).toHaveLength(4);expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4)});
});