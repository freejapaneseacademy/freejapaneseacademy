import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m02-c01-l01-v1.json';
import { questions, QUIZ_ID, scoreOwnershipContext } from '../../src/components/interactive/OwnershipContextPractice';

describe('N5-M02-C01-L01 ownership context',()=>{
  it('has a stable unique versioned bank with valid keyed choices and rationales',()=>{
    expect(QUIZ_ID).toBe('n5-m02-c01-l01-context-v1');
    expect(bank.items).toHaveLength(10);
    expect(new Set(questions.map(q=>q.id)).size).toBe(10);
    for(const q of questions){
      expect(q.id).toMatch(/^ex-n5-m02-c01-l01-q\d\d-v1$/);
      expect(q.status).toBe('internally-checked');
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.some(c=>c.id===q.answerKey.choiceId)).toBe(true);
      expect(q.choices.every(c=>c.rationale.length>5)).toBe(true);
    }
  });
  it('scores only exact keys and ignores unanswered items',()=>{
    expect(scoreOwnershipContext({})).toBe(0);
    const correct=Object.fromEntries(questions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreOwnershipContext(correct)).toBe(10);
    expect(scoreOwnershipContext({...correct,[questions[0].id]:'invalid'})).toBe(9);
  });
});
