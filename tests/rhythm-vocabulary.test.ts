import { describe, expect, it } from 'vitest';
import { contrastQuestions } from '../src/components/interactive/RhythmVocabularyPractice';

describe('Chapter 03 L02 written vocabulary bank', () => {
  it('has eight stable distinct questions and exactly one valid answer each', () => {
    expect(contrastQuestions).toHaveLength(8);
    expect(new Set(contrastQuestions.map(q => q.id)).size).toBe(8);
    for (const q of contrastQuestions) {
      expect(q.id).toMatch(/^l0-m01-c03-l02-q\d{2}$/);
      expect(q.options).toHaveLength(3);
      expect(new Set(q.options).size).toBe(3);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(q.options.length);
      expect(q.feedback.length).toBeGreaterThan(20);
      expect(q.wrong.length).toBeGreaterThan(20);
    }
  });
  it('keys actual written contrasts rather than acoustic evidence', () => {
    expect(contrastQuestions[0].options[contrastQuestions[0].answer]).toBe('おばあさん');
    expect(contrastQuestions[1].options[contrastQuestions[1].answer]).toBe('きって');
    expect(contrastQuestions[2].options[contrastQuestions[2].answer]).toBe('さっか');
    expect(contrastQuestions[5].options[contrastQuestions[5].answer]).toBe('さんぽ');
  });
});
