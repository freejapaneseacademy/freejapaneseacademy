import { describe, it, expect } from 'vitest';
import { adjectiveQuestions, scoreAdjectives } from '../../src/components/interactive/AdjectiveGrammarPractice';

describe('adjective grammar lesson', () => {
  it('has twelve unique, valid answer keys and rationales', () => {
    expect(adjectiveQuestions).toHaveLength(12);
    expect(new Set(adjectiveQuestions.map(q=>q.id)).size).toBe(12);
    for (const q of adjectiveQuestions) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c=>c.text)).size).toBe(3);
      expect(q.choices.filter(c=>c.id===q.answerKey.choiceId)).toHaveLength(1);
      expect(q.choices.every(c=>c.rationale.length>0)).toBe(true);
    }
  });
  it('scores only correct choices', () => {
    expect(scoreAdjectives({})).toBe(0);
    const correct=Object.fromEntries(adjectiveQuestions.map(q=>[q.id,q.answerKey.choiceId]));
    expect(scoreAdjectives(correct)).toBe(12);
    const wrong=Object.fromEntries(adjectiveQuestions.map(q=>[q.id,q.choices.find(c=>c.id!==q.answerKey.choiceId)!.id]));
    expect(scoreAdjectives(wrong)).toBe(0);
  });
});
