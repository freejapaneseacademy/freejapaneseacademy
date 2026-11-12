import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m07-c01-l05-v1.json';
import { QUIZ_ID, questions, scoreHobbyReading } from '../components/interactive/HobbyProfileReadingPractice';
describe('n5-m07-c01-l05 original hobby profile reading',()=>{
  it('has twelve unique evidence-backed questions with distinct keyed choices',()=>{
    expect(QUIZ_ID).toBe('n5-m07-c01-l05-reading-v1');
    expect(questions).toHaveLength(12);
    expect(new Set(bank.items.map(q=>q.id)).size).toBe(12);
    for(const q of bank.items){
      expect(q.id).toMatch(/^ex-n5-m07-c01-l05-q\d\d-v1$/);
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>15)).toBe(true);
      expect(q.evidence.length).toBeGreaterThan(5);
    }
  });
  it('scores only exact keyed answers',()=>{
    expect(scoreHobbyReading({})).toBe(0);
    expect(scoreHobbyReading(Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreHobbyReading(Object.fromEntries(questions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id])))).toBe(0);
  });
});
