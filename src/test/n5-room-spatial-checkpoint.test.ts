import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m02-c04-chk-v1.json';
import {gradeRoomCheckpoint} from '../components/interactive/RoomSpatialCheckpoint';
describe('Room description chapter checkpoint',()=>{
 it('contains fourteen distinct evidence-backed questions with complete keys',()=>{
  expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);
  for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.id)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('separates written and listening scores',()=>{
  expect(bank.items.filter(q=>q.skills[0]==='grammar')).toHaveLength(6);
  expect(bank.items.filter(q=>q.skills[0]==='reading')).toHaveLength(4);
  expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4);
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradeRoomCheckpoint(answers)).toEqual({correct:14,total:14});
  expect(gradeRoomCheckpoint(answers,true)).toEqual({correct:10,total:10});
  expect(gradeRoomCheckpoint({})).toEqual({correct:0,total:14});
  expect(bank.scoring.officialJLPTScore).toBe(false);
 });
});