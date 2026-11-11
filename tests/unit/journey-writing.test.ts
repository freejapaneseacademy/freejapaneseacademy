import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c01-l07-v1.json';
import { journeyWritingQuestions, scoreJourneyWriting, JOURNEY_WRITING_QUIZ_ID } from '../../src/components/interactive/JourneyWritingPractice';
describe('n5-m05-c01-l07 writing support',()=>{
 it('has ten unique keyed questions with explanatory feedback',()=>{
  expect(bank.lessonId).toBe('n5-m05-c01-l07');expect(journeyWritingQuestions).toHaveLength(10);
  expect(new Set(journeyWritingQuestions.map(q=>q.id)).size).toBe(10);
  for(const q of journeyWritingQuestions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
 it('scores fixed answers but never free writing',()=>{
  const correct=Object.fromEntries(journeyWritingQuestions.map(q=>[q.id,q.answerKey.choiceId]));
  const wrong=Object.fromEntries(journeyWritingQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
  expect(scoreJourneyWriting(correct)).toBe(10);expect(scoreJourneyWriting(wrong)).toBe(0);expect(scoreJourneyWriting({})).toBe(0);expect(JOURNEY_WRITING_QUIZ_ID).toBe('n5-m05-c01-l07-v1');
 });
});