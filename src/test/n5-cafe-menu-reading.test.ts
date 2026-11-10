import {describe,it,expect} from 'vitest';
import {questions,scoreMenuReading,QUIZ_ID} from '../components/interactive/CafeMenuReadingPractice';
describe('n5-m04-c01-l05 menu reading',()=>{
 it('has twelve unique evidence-backed valid items',()=>{expect(questions).toHaveLength(12);expect(new Set(questions.map(q=>q.id)).size).toBe(12);for(const q of questions){expect(q.id).toMatch(/^ex-n5-m04-c01-l05-q\d\d-v1$/);expect(q.choices).toHaveLength(4);expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);expect(q.explanation).toContain('Evidence:');expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);}});
 it('scores deterministically and persists stable ID',()=>{const a=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));expect(scoreMenuReading(a)).toBe(12);expect(scoreMenuReading({})).toBe(0);expect(QUIZ_ID).toBe('n5-m04-c01-l05-menu-reading-v1');});
 it('contains exclusions and exact prices',()=>{expect(questions[1].explanation).toContain('600円');expect(questions[6].explanation).toContain('ついていません');});
});
