import { describe,it,expect } from 'vitest';
import { invitationRoleplayQuestions,scoreInvitationRoleplay } from '../../src/components/interactive/InvitationRoleplayPractice';
describe('invitation role-play written check',()=>{
 it('has twelve unique questions with valid answers and rationales',()=>{
  expect(invitationRoleplayQuestions).toHaveLength(12);
  expect(new Set(invitationRoleplayQuestions.map(q=>q.id)).size).toBe(12);
  for(const q of invitationRoleplayQuestions){
   expect(q.choices).toHaveLength(3);
   expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);
  }
 });
 it('scores exact keys and rejects distractors',()=>{
  expect(scoreInvitationRoleplay({})).toBe(0);
  expect(scoreInvitationRoleplay(Object.fromEntries(invitationRoleplayQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreInvitationRoleplay(Object.fromEntries(invitationRoleplayQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});
