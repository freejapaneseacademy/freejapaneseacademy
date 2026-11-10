import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c01-l02-v1.json';
import {questions,QUIZ_ID,scoreDatesCounters} from '../../src/components/interactive/DatesCountersPractice';
describe('n5-m03-c01-l02 date vocabulary',()=>{
 it('contains fourteen unique well-keyed items with feedback',()=>{
 expect(QUIZ_ID).toBe('n5-m03-c01-l02-dates-counters-v1');expect(bank.items).toHaveLength(14);
 expect(new Set(questions.map(q=>q.id)).size).toBe(14);
 for(const q of questions){expect(q.id).toMatch(/^ex-n5-m03-c01-l02-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}
 });
 it('scores exact IDs only',()=>{expect(scoreDatesCounters({})).toBe(0);const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreDatesCounters(all)).toBe(14);expect(scoreDatesCounters({...all,[questions[0].id]:'invalid'})).toBe(13);});
});
