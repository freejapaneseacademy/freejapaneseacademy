import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m01-c03-chk-v1.json';
describe('N5 family checkpoint',()=>{
 it('has fourteen distinct, keyed questions',()=>{expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);}});
 it('separates ten written and four listening items',()=>{expect(bank.items.filter(q=>q.skills[0]!=='listening')).toHaveLength(10);expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4);});
});