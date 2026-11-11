import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m02-c02-chk-v1.json';
import {gradePlacesCheckpoint} from '../components/interactive/PlacesDirectionsCheckpoint';
describe('Places and directions chapter checkpoint',()=>{
 it('has fourteen distinct evidence-based questions with complete keys and feedback',()=>{
  expect(bank.items).toHaveLength(14);expect(new Set(bank.items.map(q=>q.id)).size).toBe(14);
  for(const q of bank.items){expect(q.choices).toHaveLength(4);expect(new Set(q.choices.map(c=>c.id)).size).toBe(4);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.evidence.length).toBeGreaterThan(3);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('separates map and grammar from listening and preserves stable grading',()=>{
  expect(bank.items.filter(q=>q.skills[0]==='grammar')).toHaveLength(6);
  expect(bank.items.filter(q=>q.skills[0]==='reading')).toHaveLength(4);
  expect(bank.items.filter(q=>q.skills[0]==='listening')).toHaveLength(4);
  const answers=Object.fromEntries(bank.items.map(q=>[q.id,q.answerKey.choiceId]));
  expect(gradePlacesCheckpoint(answers)).toEqual({correct:14,total:14});
  expect(gradePlacesCheckpoint(answers,true)).toEqual({correct:10,total:10});
  expect(gradePlacesCheckpoint({})).toEqual({correct:0,total:14});
  expect(bank.scoring.officialJLPTScore).toBe(false);
 });
});
