import {describe,it,expect} from 'vitest';
import bank from '../content/exercises/n5-m04-c04-l01-v1.json';
import {QUIZ_ID,questions,scoreInvitationsContext} from '../components/interactive/InvitationsContextPractice';
describe('invitation context bank',()=>{
 it('has twelve unique keyed questions and rationale',()=>{
 expect(bank.lessonId).toBe('n5-m04-c04-l01');expect(questions).toHaveLength(12);
 expect(new Set(questions.map(q=>q.id)).size).toBe(12);
 for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.id).toMatch(/^ex-n5-m04-c04-l01-q\d\d-v1$/);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.explanation.length).toBeGreaterThan(12);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);}
 });
 it('scores keyed answers without inflating unanswered items',()=>{const all=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreInvitationsContext(all)).toBe(12);expect(scoreInvitationsContext({})).toBe(0);expect(QUIZ_ID).toBe('n5-m04-c04-l01-context-v1');});
});