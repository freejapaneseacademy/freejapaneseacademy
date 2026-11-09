import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m01-c04-chk-v1.json';
import {gradeProfileCheckpoint} from '../components/interactive/N5PersonalProfileCheckpoint';
describe('N5 personal profiles checkpoint',()=>{
 it('has fourteen uniquely keyed items with evidence and feedback',()=>{
 expect(bank.items).toHaveLength(14);
 expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);
 for(const q of bank.items){expect(q.choices).toHaveLength(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('separates ten written and four listening questions',()=>{
 expect(bank.items.filter(q=>q.skills[0]!=='listening')).toHaveLength(10);
 expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4);
 });
 it('grades answer keys without assigning an official score',()=>{
 const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
 expect(gradeProfileCheckpoint(answers)).toEqual({correct:14,total:14});
 expect(gradeProfileCheckpoint(answers,true)).toEqual({correct:10,total:10});
 expect(bank.scoring.officialJLPTScore).toBe(false);
 });
});