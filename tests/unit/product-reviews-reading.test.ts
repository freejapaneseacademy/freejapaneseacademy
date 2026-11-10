import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c03-l05-v1.json';
import {scoreReviewReading} from '../../src/components/interactive/ProductReviewReading';
describe('n5-m04-c03-l05 review reading',()=>{
 it('has ten unique keyed evidence questions',()=>{expect(bank.items).toHaveLength(10);expect(new Set(bank.items.map(q=>q.id)).size).toBe(10);
 for(const q of bank.items){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation).toContain('Evidence:');}});
 it('scores correct and incorrect attempts',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreReviewReading(answers)).toBe(10);expect(scoreReviewReading({})).toBe(0);answers[bank.items[0].id]='wrong';expect(scoreReviewReading(answers)).toBe(9);});
});