import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m01-c03-l05-v1.json';
import { scoreFamilyReading } from '../../src/components/interactive/FamilyChartReading';
describe('n5-m01-c03-l05 reading assessment',()=>{
 it('has unique versioned items and complete rationale',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}});
 it('scores full and empty responses',()=>{expect(scoreFamilyReading(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(scoreFamilyReading({})).toBe(0)});
 it('rejects one wrong answer',()=>{const a=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));a[bank.items[0].id]='missing';expect(scoreFamilyReading(a)).toBe(9)});
});