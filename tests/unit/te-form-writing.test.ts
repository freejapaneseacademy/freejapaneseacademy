import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l07-v1.json';
import { scoreTeWriting } from '../../src/components/interactive/TeFormWritingPractice';
describe('n5-m06-c02-l07 writing recognition',()=>{
 it('has 12 distinct keyed items with feedback and three distinct choices',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}});
 it('scores only matching keyed choices',()=>{const correct=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreTeWriting(correct)).toBe(12);expect(scoreTeWriting({})).toBe(0);const first=bank.items[0];expect(scoreTeWriting({...correct,[first.id]:first.choices[1].id})).toBe(11);});
});