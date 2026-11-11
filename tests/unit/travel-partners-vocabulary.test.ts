import { describe,expect,it } from 'vitest';
import bank from '../../src/content/exercises/n5-m05-c02-l02-v1.json';
import {questions,QUIZ_ID,scoreTravelPartners} from '../../src/components/interactive/TravelPartnersPractice';
describe('n5-m05-c02-l02 travel partners vocabulary',()=>{
 it('has twelve unique, answerable items with feedback',()=>{
 expect(QUIZ_ID).toBe('n5-m05-c02-l02-vocab-v1');expect(bank.items).toHaveLength(12);
 expect(new Set(questions.map(q=>q.id)).size).toBe(12);
 for(const q of questions){expect(q.id).toMatch(/^ex-n5-m05-c02-l02-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.explanation.length).toBeGreaterThan(10);}
 });
 it('scores exact answers only',()=>{expect(scoreTravelPartners({})).toBe(0);const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreTravelPartners(all)).toBe(12);expect(scoreTravelPartners({...all,[questions[0].id]:'invalid'})).toBe(11);});
});