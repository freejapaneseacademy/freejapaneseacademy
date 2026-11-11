import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c04-l07-v1.json';
import { writingQuestions, scoreInvitationWriting, WRITING_QUIZ_ID } from '../../src/components/interactive/InvitationWritingPractice';
describe('n5-m04-c04-l07 writing support',()=>{
 it('has ten unique keyed questions and explanatory feedback',()=>{
 expect(bank.lessonId).toBe('n5-m04-c04-l07');expect(writingQuestions).toHaveLength(10);
 expect(new Set(writingQuestions.map(q=>q.id)).size).toBe(10);
 for(const q of writingQuestions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>12)).toBe(true);expect(q.objectiveIds.length).toBeGreaterThan(0);}
 });
 it('scores only fixed-answer recognition, not free composition',()=>{
 const correct=Object.fromEntries(writingQuestions.map(q=>[q.id,q.answerKey.choiceId]));
 const wrong=Object.fromEntries(writingQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
 expect(scoreInvitationWriting(correct)).toBe(10);expect(scoreInvitationWriting(wrong)).toBe(0);expect(scoreInvitationWriting({})).toBe(0);expect(WRITING_QUIZ_ID).toBe('n5-m04-c04-l07-v1');
 });
});
