import {describe,it,expect} from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c01-l05-v1.json';
import {questions,QUIZ_ID,scoreLostFoundReading} from '../../src/components/interactive/LostFoundReadingPractice';
describe('n5-m02-c01-l05 written evidence reading',()=>{
 it('has ten uniquely keyed, explained, versioned items',()=>{
 expect(QUIZ_ID).toBe('n5-m02-c01-l05-reading-v1');
 expect(bank.items).toHaveLength(10);
 expect(new Set(questions.map(q=>q.id)).size).toBe(10);
 for(const q of questions){expect(q.id).toMatch(/^ex-n5-m02-c01-l05-q\d\d-v1$/);expect(q.status).toBe('internally-checked');expect(q.choices).toHaveLength(3);expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);expect(q.explanation).toContain('Evidence:');}
 });
 it('scores only selected correct answers',()=>{expect(scoreLostFoundReading({})).toBe(0);const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreLostFoundReading(correct)).toBe(10);expect(scoreLostFoundReading({...correct,[questions[0].id]:'bad'})).toBe(9);});
});