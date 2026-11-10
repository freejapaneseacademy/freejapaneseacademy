import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m03-c02-l02-v1.json';
import {questions,scoreDailyVerbs,QUIZ_ID} from '../../src/components/interactive/DailyVerbsPractice';
describe('n5-m03-c02-l02 daily verb bank',()=>{
 it('has 12 unique versioned questions and plausible distinct choices',()=>{expect(bank.lessonId).toBe('n5-m03-c02-l02');expect(questions).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);for(const q of questions){expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.find(c=>c.id===q.answerKey.choiceId)).toBeTruthy();expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);}});
 it('scores all correct and none correct',()=>{expect(scoreDailyVerbs(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);expect(scoreDailyVerbs({})).toBe(0);expect(QUIZ_ID).toContain('n5-m03-c02-l02');});
});