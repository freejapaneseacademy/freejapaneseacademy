import {describe,it,expect} from 'vitest';
import {studyToolsVocabularyQuestions as questions,scoreStudyToolsVocabulary,studyToolsVocabularyQuizId} from './studyToolsVocabularyPractice';
describe('Chapter 04 lesson 02 vocabulary assessment',()=>{
 it('has twelve distinct stable question IDs and a stable progress key',()=>{
  expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  expect(questions.every(q=>/^c04l02-q\d{2}$/.test(q.id))).toBe(true);
  expect(studyToolsVocabularyQuizId).toBe('l0-m01-c04-l02-vocabulary-v1');
 });
 it('has a unique correct answer and substantive feedback for each question',()=>{
  for(const q of questions){
   expect(q.choices.length).toBeGreaterThanOrEqual(3);
   expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);
   expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
   expect(q.explanation.length).toBeGreaterThan(35);
   for(const c of q.choices)expect(c.rationale.length).toBeGreaterThan(10);
  }
 });
 it('scores all-correct, all-wrong, and partially answered attempts',()=>{
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreStudyToolsVocabulary(correct)).toBe(12);
  expect(scoreStudyToolsVocabulary(wrong)).toBe(0);
  expect(scoreStudyToolsVocabulary({[questions[0].id]:questions[0].answerKey.choiceId})).toBe(1);
 });
});
