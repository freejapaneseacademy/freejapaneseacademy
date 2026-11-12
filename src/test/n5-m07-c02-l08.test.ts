import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m07-c02-l08-v1.json';
import { QUIZ_ID, questions, scoreWishesRoleplay } from '../components/interactive/WishesRoleplay';
describe('n5-m07-c02-l08 optional wishes roleplay',()=>{
  it('contains 12 distinct, keyed, evidence-backed recognition items',()=>{
    expect(QUIZ_ID).toBe('n5-m07-c02-l08-recognition-v1');
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map(q=>q.id)).size).toBe(12);
    expect(bank.lessonId).toBe('n5-m07-c02-l08');
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m07-c02-l08-q\d\d-v1$/);
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
      expect(q.evidence.length).toBeGreaterThan(3);
    }
  });
  it('scores exact answers only',()=>{
    expect(scoreWishesRoleplay({})).toBe(0);
    expect(scoreWishesRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreWishesRoleplay(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
