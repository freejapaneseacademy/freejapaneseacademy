import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c03-l07-v1.json';
import { gradeDirectionsWriting } from '../../src/components/interactive/DirectionsWritingWorkshop';
describe('n5-m05-c03-l07 writing bank',()=>{
 it('has twelve unique answerable questions with individual feedback',()=>{expect(bank.items).toHaveLength(12);expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true)}});
 it('scores keyed and empty submissions',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeDirectionsWriting(answers)).toBe(12);expect(gradeDirectionsWriting({})).toBe(0)});
});