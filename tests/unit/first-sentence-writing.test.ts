import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/l0-m05-c03-l07-v1.json';
import { gradeFirstSentenceWriting } from '../../src/components/interactive/FirstSentenceWriting';
describe('first sentence writing',()=>{
 it('has eight unique valid questions with rationales',()=>{expect(bank.items).toHaveLength(8);expect(new Set(bank.items.map(q=>q.id)).size).toBe(8);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.id)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores by stable choice ids',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeFirstSentenceWriting(answers)).toBe(8);expect(gradeFirstSentenceWriting({})).toBe(0);});
});
