import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l08-v1.json';
import {questions,QUIZ_ID,scoreTeFormRoleplay} from '../../src/components/interactive/TeFormRoleplay';
describe('n5-m06-c02-l08 optional speaking',()=>{
 it('has unique, fully keyed written practice',()=>{expect(QUIZ_ID).toBe('n5-m06-c02-l08-speaking-prep-v1');expect(bank.items).toHaveLength(8);expect(new Set(questions.map(q=>q.id)).size).toBe(8);for(const q of questions){expect(q.id).toMatch(/^ex-n5-m06-c02-l08-q\d\d-v1$/);expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('scores written choices only, never speech',()=>{expect(scoreTeFormRoleplay({})).toBe(0);const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreTeFormRoleplay(correct)).toBe(8);expect(scoreTeFormRoleplay({...correct,[questions[0].id]:'wrong'})).toBe(7);});
});