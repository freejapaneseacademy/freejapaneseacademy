import {describe,it,expect} from 'vitest';
import { firstLessonId, firstLessonQuizId, scriptQuestions, scoreScriptQuestions, validateScriptQuestions } from '../src/lib/foundationsPractice';
describe('first Foundations lesson practice',()=>{
 it('uses stable blueprint identifiers and internally valid answer keys',()=>{
  expect(firstLessonId).toBe('l0-m01-c01-l01');
  expect(firstLessonQuizId).toContain(firstLessonId);
  expect(validateScriptQuestions(scriptQuestions)).toBe(true);
  expect(scriptQuestions).toHaveLength(8);
 });
 it('scores all correct responses',()=>{
  const answers=Object.fromEntries(scriptQuestions.map(q=>[q.id,q.answerKey]));
  expect(scoreScriptQuestions(scriptQuestions,answers)).toBe(8);
 });
 it('scores blank and wrong responses without awarding credit',()=>{
  expect(scoreScriptQuestions(scriptQuestions,{})).toBe(0);
  const answers=Object.fromEntries(scriptQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey)!.id]));
  expect(scoreScriptQuestions(scriptQuestions,answers)).toBe(0);
 });
 it('has a specific rationale for every choice',()=>{
  for(const q of scriptQuestions){expect(q.objectiveIds.length).toBeGreaterThan(0);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true)}
 });
});
