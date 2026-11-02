import { describe, expect, it } from 'vitest';
import {
  soundWritingLessonId, soundWritingQuizId, soundWritingQuestions, soundWritingPalette,
  soundWritingCards, soundWritingRubric, normalizeSoundWriting, isSoundWritingCorrect,
  scoreSoundWriting, validateSoundWritingQuestions
} from '../src/lib/soundWritingPractice';

describe('Chapter 02 L07 written Japanese production', () => {
  it('has ten versioned, valid, uniquely identified and typeable questions', () => {
    expect(soundWritingLessonId).toBe('l0-m01-c02-l07');
    expect(soundWritingQuizId).toBe('l0-m01-c02-l07-check-v1');
    expect(soundWritingQuestions).toHaveLength(10);
    expect(validateSoundWritingQuestions(soundWritingQuestions)).toBe(true);
    expect(new Set(soundWritingQuestions.map(q => q.id)).size).toBe(10);
    for (const q of soundWritingQuestions) {
      expect(q.answerKey.accepted).toHaveLength(1);
      expect([...q.answerKey.accepted[0]].every(char => soundWritingPalette.includes(char as typeof soundWritingPalette[number]))).toBe(true);
    }
  });
  it('preserves meaningful long-vowel distinctions and rejects romaji', () => {
    const answers = Object.fromEntries(soundWritingQuestions.map(q => [q.id, q.answerKey.accepted[0]]));
    expect(scoreSoundWriting(soundWritingQuestions, answers)).toBe(10);
    expect(scoreSoundWriting(soundWritingQuestions, {})).toBe(0);
    expect(normalizeSoundWriting('  いいえ  ')).toBe('いいえ');
    const house = soundWritingQuestions[6];
    const no = soundWritingQuestions[7];
    const aunt = soundWritingQuestions[8];
    const grandmother = soundWritingQuestions[9];
    expect(isSoundWritingCorrect(house, 'いえ')).toBe(true);
    expect(isSoundWritingCorrect(house, 'いいえ')).toBe(false);
    expect(isSoundWritingCorrect(no, 'いいえ')).toBe(true);
    expect(isSoundWritingCorrect(no, 'いえ')).toBe(false);
    expect(isSoundWritingCorrect(aunt, 'おばあさん')).toBe(false);
    expect(isSoundWritingCorrect(grandmother, 'おばあさん')).toBe(true);
    expect(isSoundWritingCorrect(grandmother, 'おばさん')).toBe(false);
    expect(isSoundWritingCorrect(grandmother, 'obaasan')).toBe(false);
  });
  it('uses contextual guided choices and an ungraded self-review rubric', () => {
    expect(soundWritingCards).toHaveLength(4);
    expect(soundWritingCards.map(card => card.correct)).toEqual(['いえ', 'いいえ', 'おばさん', 'おばあさん']);
    expect(soundWritingCards.every(card => (card.options as readonly string[]).includes(card.correct))).toBe(true);
    expect(soundWritingRubric).toHaveLength(4);
    expect(new Set(soundWritingRubric.map(item => item.id)).size).toBe(4);
  });
});
