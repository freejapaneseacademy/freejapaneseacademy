import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c04-l05-v1.json';
import { questions, scoreTravelNotice, QUIZ_ID } from '../../src/components/interactive/TravelNoticePractice';
describe('n5-m05-c04-l05 reading integrity',()=>{
 it('has twelve unique versioned questions with distinct options and valid keys',()=>{
  expect(QUIZ_ID).toBe('n5-m05-c04-l05-reading-v1');expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of bank.items){expect(q.id).toMatch(/^ex-n5-m05-c04-l05-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.explanation.length).toBeGreaterThan(12);}
 });
 it('scores keyed answers',()=>{const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreTravelNotice(correct)).toBe(12);expect(scoreTravelNotice({})).toBe(0);expect(scoreTravelNotice({...correct,[questions[0].id]:'wrong'})).toBe(11);});
});