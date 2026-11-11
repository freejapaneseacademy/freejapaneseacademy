import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m06-c02-l01-v1.json';
import {teContextQuestions,scoreTeContext,TE_CONTEXT_QUIZ_ID} from '../../src/components/interactive/TeFormContextPractice';
describe('te-form context introduction',()=>{
 it('has stable IDs and twelve distinct items',()=>{expect(TE_CONTEXT_QUIZ_ID).toBe('n5-m06-c02-l01-v1');expect(bank.lessonId).toBe('n5-m06-c02-l01');expect(teContextQuestions).toHaveLength(12);expect(new Set(teContextQuestions.map(q=>q.id)).size).toBe(12);});
 it('has valid answer keys and feedback',()=>{for(const q of teContextQuestions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);expect(q.explanation.length).toBeGreaterThan(20);}});
 it('scores correct, wrong and empty answers',()=>{const correct=Object.fromEntries(teContextQuestions.map(q=>[q.id,q.answerKey.choiceId]));const wrong=Object.fromEntries(teContextQuestions.map(q=>[q.id,'c2']));expect(scoreTeContext(correct)).toBe(12);expect(scoreTeContext(wrong)).toBe(0);expect(scoreTeContext({})).toBe(0);});
});
