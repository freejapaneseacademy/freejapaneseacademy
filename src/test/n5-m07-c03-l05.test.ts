import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m07-c03-l05-v1.json';
import {questions,scoreComparisonChart,QUIZ_ID} from '../components/interactive/ComparisonChartReading';
describe('n5-m07-c03-l05 comparison chart',()=>{
 it('has twelve unique keyed questions with evidence',()=>{
  expect(bank.lessonId).toBe('n5-m07-c03-l05');expect(questions).toHaveLength(12);
  expect(new Set(questions.map(q=>q.id)).size).toBe(12);
  for(const q of questions){expect(q.id).toMatch(/^ex-n5-m07-c03-l05-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation).toMatch(/Evidence/);}
 });
 it('scores correct, incorrect and blank answers',()=>{
  expect(QUIZ_ID).toContain('n5-m07-c03-l05');
  expect(scoreComparisonChart({})).toBe(0);
  expect(scoreComparisonChart(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
  expect(scoreComparisonChart(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
 });
});