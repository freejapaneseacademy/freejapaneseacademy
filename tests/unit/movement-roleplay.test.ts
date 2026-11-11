import { describe,it,expect } from 'vitest';
import { movementRoleplayQuestions,scoreMovementRoleplay,MOVEMENT_ROLEPLAY_QUIZ_ID } from '../../src/components/interactive/MovementRoleplayPractice';
describe('movement role-play written knowledge check',()=>{
 it('has twelve unique questions with distinct choices and valid answer keys',()=>{
  expect(movementRoleplayQuestions).toHaveLength(12);
  expect(new Set(movementRoleplayQuestions.map(q=>q.id)).size).toBe(12);
  for(const q of movementRoleplayQuestions){expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}
 });
 it('scores exact answers, never guesses',()=>{
  expect(scoreMovementRoleplay({})).toBe(0);
  expect(scoreMovementRoleplay(Object.fromEntries(movementRoleplayQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreMovementRoleplay(Object.fromEntries(movementRoleplayQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  expect(MOVEMENT_ROLEPLAY_QUIZ_ID).toBe('n5-m05-c01-l08-v1');
 });
});
