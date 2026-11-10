import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c01-l07-v1.json';
import { questions, QUIZ_ID, scoreNotice } from '../../src/components/interactive/WorkshopNoticeWriting';
describe('n5-m03-c01-l07 notice writing',()=>{
 it('contains unique keyed questions with feedback',()=>{
  expect(QUIZ_ID).toBe('n5-m03-c01-l07-writing-v1');
  expect(bank.items).toHaveLength(8);
  expect(new Set(questions.map(q=>q.id)).size).toBe(8);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m03-c01-l07-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>8)).toBe(true);expect(q.explanation.length).toBeGreaterThan(8);}
 });
 it('scores keyed choices only',()=>{expect(scoreNotice({})).toBe(0);const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreNotice(correct)).toBe(8);expect(scoreNotice({...correct,[questions[0].id]:'wrong'})).toBe(7);});
});
