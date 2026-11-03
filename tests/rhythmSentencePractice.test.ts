import { describe, expect, it } from 'vitest';
import { rhythmSentenceQuestions, rhythmSentenceQuizId, scoreRhythmSentence } from '../src/lib/rhythmSentencePractice';

describe('Chapter 03 L03 written sentence evidence', () => {
  it('has eight unique stable question IDs with exactly one valid key', () => {
    expect(rhythmSentenceQuizId).toBe('l0-m01-c03-l03-written-v1');
    expect(rhythmSentenceQuestions).toHaveLength(8);
    expect(new Set(rhythmSentenceQuestions.map(q=>q.id)).size).toBe(8);
    for (const q of rhythmSentenceQuestions) {
      expect(q.prompt.length).toBeGreaterThan(10);
      expect(q.explanation.length).toBeGreaterThan(30);
      expect(q.choices.filter(c=>c.id===q.correct)).toHaveLength(1);
      expect(new Set(q.choices.map(c=>c.id)).size).toBe(q.choices.length);
    }
  });
  it('scores only exact keyed choices', () => {
    const correct=Object.fromEntries(rhythmSentenceQuestions.map(q=>[q.id,q.correct]));
    expect(scoreRhythmSentence(correct)).toBe(8);
    expect(scoreRhythmSentence({})).toBe(0);
    const wrong=Object.fromEntries(rhythmSentenceQuestions.map(q=>[q.id,'not-a-choice']));
    expect(scoreRhythmSentence(wrong)).toBe(0);
  });
  it('covers long vowels, consonant holds, nasal mora and contextual meaning', () => {
    const ids=rhythmSentenceQuestions.map(q=>q.id);
    expect(ids).toEqual(expect.arrayContaining(['family','stamp','book','negative','wait','nasal','writer','mora']));
  });
});
