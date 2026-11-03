import { describe, expect, it } from 'vitest';
import { rhythmContextQuestions, rhythmContextQuizId, scoreRhythmContext } from '../src/lib/rhythmContextPractice';

describe('Chapter 03 L01 written context check',()=>{
  it('has 12 distinct, meaningful, scored questions',()=>{
    expect(rhythmContextQuestions).toHaveLength(12);
    expect(new Set(rhythmContextQuestions.map(q=>q.id)).size).toBe(12);
    expect(rhythmContextQuizId).toBe('l0-m01-c03-l01-written-context-v1');
    for(const q of rhythmContextQuestions){
      expect(q.explanation.length).toBeGreaterThan(20);
      expect(q.choices).toHaveLength(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c=>c.rationale.length>10)).toBe(true);
    }
  });
  it('scores all correct, all incorrect and unanswered independently',()=>{
    expect(scoreRhythmContext({})).toBe(0);
    expect(scoreRhythmContext(Object.fromEntries(rhythmContextQuestions.map(q=>[q.id,q.answerKey.choiceId])))).toBe(12);
    expect(scoreRhythmContext(Object.fromEntries(rhythmContextQuestions.map(q=>[q.id,'not-a-choice'])))).toBe(0);
  });
});
