import { describe, expect, it } from 'vitest';
import bank from '../content/exercises/n5-m06-c04-l05-v1.json';
import { scorePhotoCaptions } from '../components/interactive/PhotoCaptionReadingPractice';

describe('n5-m06-c04-l05 photo captions', () => {
  it('has twelve unique, unambiguous, feedback-rich written questions', () => {
    expect(bank.items).toHaveLength(12);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(12);
    for (const question of bank.items) {
      expect(question.choices).toHaveLength(3);
      expect(new Set(question.choices.map(c => c.text)).size).toBe(3);
      expect(question.choices.filter(c => c.id === question.answerKey.choiceId)).toHaveLength(1);
      expect(question.choices.every(c => c.rationale.length > 25)).toBe(true);
      expect(question.explanation).toMatch(/Evidence:/);
    }
  });
  it('scores all correct, all wrong and empty submissions', () => {
    expect(scorePhotoCaptions(Object.fromEntries(bank.items.map(q => [q.id, q.answerKey.choiceId])))).toBe(12);
    expect(scorePhotoCaptions(Object.fromEntries(bank.items.map(q => [q.id, q.choices.find(c => c.id !== q.answerKey.choiceId)!.id])))).toBe(0);
    expect(scorePhotoCaptions({})).toBe(0);
  });
});
