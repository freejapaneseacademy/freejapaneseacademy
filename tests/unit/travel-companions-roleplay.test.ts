import { describe,it,expect } from 'vitest';
import { travelCompanionRoleplayQuestions,scoreTravelCompanionRoleplay,TRAVEL_COMPANION_ROLEPLAY_QUIZ_ID } from '../../src/components/interactive/TravelCompanionRoleplayPractice';
describe('travel companions optional role play written check',()=>{
 it('has twelve unique keyed items with individual feedback',()=>{
  expect(travelCompanionRoleplayQuestions).toHaveLength(12);
  expect(new Set(travelCompanionRoleplayQuestions.map(q=>q.id)).size).toBe(12);
  for(const q of travelCompanionRoleplayQuestions){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('scores keyed responses, not pronunciation',()=>{
  expect(scoreTravelCompanionRoleplay({})).toBe(0);
  expect(scoreTravelCompanionRoleplay(Object.fromEntries(travelCompanionRoleplayQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreTravelCompanionRoleplay(Object.fromEntries(travelCompanionRoleplayQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  expect(TRAVEL_COMPANION_ROLEPLAY_QUIZ_ID).toBe('n5-m05-c02-l08-v1');
 });
});
