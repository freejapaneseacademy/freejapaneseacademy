import { describe, expect, it } from 'vitest';
import { scoreCheckpoint, type CheckQuestion } from './HiraganaVoicedCheckpoint';
import bank from '../../content/exercises/l0-m03-c01-chk.json';

describe('voiced-kana checkpoint bank', () => {
  const questions = bank.items as CheckQuestion[];
  it('has twelve stable unique questions with rationales and evidence', () => {
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map(q => q.id)).size).toBe(12);
    for (const q of questions) {
      expect(q.evidence.length).toBeGreaterThan(1);
      expect(q.explanation.length).toBeGreaterThan(10);
      expect(q.choices).toHaveLength(3);
      expect(q.choices.every(c => c.rationale.length > 10)).toBe(true);
      expect(q.choices.filter(c => c.id === q.answerKey.choiceId)).toHaveLength(1);
    }
  });
  it('scores perfect, empty and partial attempts correctly', () => {
    const perfect = Object.fromEntries(questions.map(q => [q.id, q.answerKey.choiceId]));
    expect(scoreCheckpoint(questions, perfect)).toBe(12);
    expect(scoreCheckpoint(questions, {})).toBe(0);
    expect(scoreCheckpoint(questions, { [questions[0].id]: questions[0].answerKey.choiceId })).toBe(1);
  });
  it('covers script, reading and listening without treating speaking as required', () => {
    expect(questions.filter(q => q.area === 'kana')).toHaveLength(4);
    expect(questions.filter(q => q.area === 'reading')).toHaveLength(4);
    expect(questions.filter(q => q.area === 'listening')).toHaveLength(4);
  });
});
