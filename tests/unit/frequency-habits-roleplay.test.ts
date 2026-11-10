import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c04-l08-v1.json';
import {questions,scoreRoleplay,QUIZ_ID} from '../../src/components/interactive/HabitRoleplay';
describe('n5-m03-c04-l08 optional roleplay',()=>{
 it('has ten unique questions with keys and distractor feedback',()=>{expect(bank.lessonId).toBe('n5-m03-c04-l08');expect(questions).toHaveLength(10);expect(new Set(questions.map(q=>q.id)).size).toBe(10);for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.find(c=>c.id===q.answerKey.choiceId)).toBeTruthy();expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);expect(q.explanation.length).toBeGreaterThan(15);}});
 it('scores all correct, unanswered and wrong answers',()=>{expect(scoreRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(scoreRoleplay({})).toBe(0);expect(scoreRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);expect(QUIZ_ID).toContain('n5-m03-c04-l08');});
});