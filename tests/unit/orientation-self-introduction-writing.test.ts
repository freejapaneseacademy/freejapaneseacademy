import { describe,it,expect } from 'vitest';
import { questions,scoreAnswers } from '../../src/components/interactive/OrientationSelfIntroductionWriting';
describe('N5-M01-C04-L07 writing bank',()=>{
 it('has eight unique valid keys and feedback',()=>{
  expect(questions).toHaveLength(8);
  expect(new Set(questions.map(q=>q.id)).size).toBe(8);
  for(const q of questions){expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(10);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores exact choice IDs',()=>{
  const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
  expect(scoreAnswers(correct)).toBe(8);
  expect(scoreAnswers({})).toBe(0);
  expect(scoreAnswers({...correct,[questions[0].id]:'wrong'})).toBe(7);
 });
});
