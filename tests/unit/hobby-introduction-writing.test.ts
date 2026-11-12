import { describe, expect, it } from 'vitest';
import bank from '../../src/content/exercises/n5-m07-c01-l07-v1.json';
import { gradeHobbyWriting } from '../../src/components/interactive/HobbyIntroductionWriting';

describe('hobby introduction writing', () => {
  it('contains eight unique, keyed questions with distinct alternatives and evidence', () => {
    expect(bank.items).toHaveLength(8);
    expect(new Set(bank.items.map(q => q.id)).size).toBe(8);
    for (const q of bank.items) {
      expect(q.choices).toHaveLength(3);
      expect(new Set(q.choices.map(c => c.text)).size).toBe(3);
      expect(q.choices.some(c => c.id === q.answerKey.choiceId)).toBe(true);
      expect(q.explanation.length).toBeGreaterThan(25);
      expect(q.evidence.length).toBeGreaterThan(3);
      expect(q.choices.every(c => c.rationale.length > 8)).toBe(true);
    }
  });
  it('grades complete, partial, empty and incorrect responses', () => {
    const full = Object.fromEntries(bank.items.map(q => [q.id,q.answerKey.choiceId]));
    expect(gradeHobbyWriting(full)).toBe(8);
    expect(gradeHobbyWriting({})).toBe(0);
    expect(gradeHobbyWriting({[bank.items[0].id]:bank.items[0].answerKey.choiceId})).toBe(1);
    const wrong = bank.items[0].choices.find(c => c.id !== bank.items[0].answerKey.choiceId)!;
    expect(gradeHobbyWriting({[bank.items[0].id]:wrong.id})).toBe(0);
  });
});
