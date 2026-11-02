import { describe, expect, it } from 'vitest';
import {
  writingQuestions, writingQuizId, writingTaskId, writingPalette, writingCards, writingRubric,
  normalizeWritingInput, isWritingAnswerCorrect, scoreWritingQuestions,
  validateWritingQuestions, buildWritingLabel, checkWritingCard
} from '../src/lib/writingPractice';

describe('L0 writing and typing lesson 07', () => {
  it('uses stable, unique, versioned production prompts with reachable keys', () => {
    expect(writingQuestions).toHaveLength(8);
    expect(validateWritingQuestions(writingQuestions)).toBe(true);
    expect(writingQuizId).toBe('l0-m01-c01-l07-check-v1');
    expect(writingTaskId).toBe('l0-m01-c01-l07-write-v1');
    expect(new Set(writingQuestions.map(q => q.id)).size).toBe(8);
    for (const q of writingQuestions) {
      expect(q.answerKey.accepted).toHaveLength(1);
      expect([...q.answerKey.accepted[0]].every(g => writingPalette[q.inputScript].includes(g))).toBe(true);
    }
  });
  it('scores real kana forms but rejects romaji, wrong scripts and missing long marks', () => {
    const correct = Object.fromEntries(writingQuestions.map(q => [q.id, q.answerKey.accepted[0]]));
    expect(scoreWritingQuestions(writingQuestions, correct)).toBe(8);
    expect(scoreWritingQuestions(writingQuestions, {})).toBe(0);
    const first = writingQuestions[0];
    expect(isWritingAnswerCorrect(first, ' あ ')).toBe(true);
    expect(isWritingAnswerCorrect(first, 'a')).toBe(false);
    expect(isWritingAnswerCorrect(first, 'ア')).toBe(false);
    const coffee = writingQuestions.find(q => q.id.endsWith('006'))!;
    expect(isWritingAnswerCorrect(coffee, 'コーヒー')).toBe(true);
    expect(isWritingAnswerCorrect(coffee, 'コヒ')).toBe(false);
    expect(isWritingAnswerCorrect(coffee, 'koohii')).toBe(false);
    expect(normalizeWritingInput('  カタカナ  ')).toBe('カタカナ');
  });
  it('checks contextual labels without claiming a grade for open writing', () => {
    expect(writingCards).toHaveLength(2);
    expect(buildWritingLabel('ひらがな')).toBe('これはひらがなです。');
    expect(buildWritingLabel('カタカナ')).toBe('これはカタカナです。');
    expect(checkWritingCard('hira-a', 'ひらがな')).toBe(true);
    expect(checkWritingCard('hira-a', 'カタカナ')).toBe(false);
    expect(checkWritingCard('kata-a', 'カタカナ')).toBe(true);
    expect(checkWritingCard('missing', 'ひらがな')).toBe(false);
    expect(new Set(writingRubric.map(item => item.id)).size).toBe(4);
    expect(writingRubric.every(item => item.check.length > 30)).toBe(true);
  });
});
