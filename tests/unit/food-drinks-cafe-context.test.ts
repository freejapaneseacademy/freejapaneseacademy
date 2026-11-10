import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m04-c01-l01-v1.json';
import {questions,scoreCafeContext,QUIZ_ID} from '../../src/components/interactive/CafeContextPractice';
describe('n5-m04-c01-l01 café context',()=>{
 it('contains ten unique, explained, unambiguous items',()=>{expect(bank.lessonId).toBe('n5-m04-c01-l01');expect(questions).toHaveLength(10);expect(new Set(questions.map(q=>q.id)).size).toBe(10);for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.find(c=>c.id===q.answerKey.choiceId)).toBeTruthy();expect(q.choices.every(c=>c.rationale.length>20)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('scores full credit, no responses, and wrong responses',()=>{expect(scoreCafeContext(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(10);expect(scoreCafeContext({})).toBe(0);expect(scoreCafeContext(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);expect(QUIZ_ID).toBe('n5-m04-c01-l01-cafe-context-v1');});
});
