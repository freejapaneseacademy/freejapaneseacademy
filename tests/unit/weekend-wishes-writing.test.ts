import { describe,it,expect } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c02-l07-v1.json';
import { gradeWeekendWishes } from '../../src/components/interactive/WeekendWishesWriting';
describe('n5-m07-c02-l07 writing recognition',()=>{
 it('has eight distinct schema-compliant questions with valid keys',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('grades exact answer keys without treating writing as scored',()=>{expect(gradeWeekendWishes({})).toBe(0);expect(gradeWeekendWishes(Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId])))).toBe(8);});
});
