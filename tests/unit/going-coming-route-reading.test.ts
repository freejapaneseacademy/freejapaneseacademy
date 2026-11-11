import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c01-l05-v1.json';
import {QUIZ_ID,questions,scoreRouteReading} from '../../src/components/interactive/RouteReadingPractice';
describe('n5-m05-c01-l05 route-plan reading',()=>{
 it('has twelve distinct keyed questions with feedback and textual evidence',()=>{
 expect(QUIZ_ID).toBe('n5-m05-c01-l05-reading-v1');expect(bank.items).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);
 for(const q of questions){expect(q.id).toMatch(/^ex-n5-m05-c01-l05-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation).toContain('Evidence:');expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}
 });
 it('scores only keyed answers',()=>{expect(scoreRouteReading({})).toBe(0);const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreRouteReading(all)).toBe(12);expect(scoreRouteReading({...all,[questions[0].id]:'wrong'})).toBe(11);});
});