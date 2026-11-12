import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c01-chk-v1.json';
import {gradeLikesCheckpoint} from '../../src/components/interactive/LikesCheckpointPractice';
describe('likes and abilities checkpoint',()=>{
 it('has fourteen unique keyed questions and valid rationales',()=>{expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);}});
 it('separates written and listening scores',()=>{const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));expect(gradeLikesCheckpoint(answers)).toEqual({correct:10,total:10});expect(gradeLikesCheckpoint(answers,true)).toEqual({correct:14,total:14});expect(gradeLikesCheckpoint({})).toEqual({correct:0,total:10});});
});