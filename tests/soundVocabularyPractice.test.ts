import { describe, expect, it } from 'vitest';
import { isSoundVocabularyCorrect, normalizeSoundVocabularyInput, scoreSoundVocabulary, soundVocabularyCards, soundVocabularyQuestions, soundVocabularyQuizId, validateSoundVocabulary } from '../src/lib/soundVocabularyPractice';

describe('L0 Chapter 02 vocabulary word study', () => {
  it('has stable unique questions, valid keys, and a separate canonical quiz ID', () => {
    expect(validateSoundVocabulary()).toBe(true);
    expect(soundVocabularyQuestions).toHaveLength(14);
    expect(soundVocabularyCards).toHaveLength(15);
    expect(soundVocabularyQuizId).toBe('l0-m01-c02-l02-check-v1');
    expect(new Set(soundVocabularyQuestions.map(q=>q.id)).size).toBe(14);
  });
  it('scores every correct answer and rejects empty or wrong responses', () => {
    const correct = Object.fromEntries(soundVocabularyQuestions.map(q => [q.id,q.type==='single-choice'?q.answerKey.choiceId:q.answerKey.accepted[0]]));
    expect(scoreSoundVocabulary(correct)).toBe(14);
    expect(scoreSoundVocabulary({})).toBe(0);
    expect(isSoundVocabularyCorrect(soundVocabularyQuestions[0], 'invalid')).toBe(false);
  });
  it('accepts kana or listed lowercase romaji without collapsing vowel length', () => {
    const house = soundVocabularyQuestions.find(q=>q.id.endsWith('011'))!;
    const blue = soundVocabularyQuestions.find(q=>q.id.endsWith('014'))!;
    expect(isSoundVocabularyCorrect(house, ' いえ ')).toBe(true);
    expect(isSoundVocabularyCorrect(house, 'ie')).toBe(true);
    expect(isSoundVocabularyCorrect(house, 'いいえ')).toBe(false);
    expect(isSoundVocabularyCorrect(house, 'iie')).toBe(false);
    expect(isSoundVocabularyCorrect(blue, 'あおい')).toBe(true);
    expect(isSoundVocabularyCorrect(blue, 'あお')).toBe(false);
    expect(isSoundVocabularyCorrect(blue, 'aoi')).toBe(true);
    expect(normalizeSoundVocabularyInput(' かさ ')).toBe('かさ');
  });
  it('rejects a duplicated or corrupted answer key', () => {
    expect(() => validateSoundVocabulary([...soundVocabularyQuestions, soundVocabularyQuestions[0]])).toThrow();
    const bad = structuredClone(soundVocabularyQuestions);
    const choice = bad[0];
    if (choice.type !== 'single-choice') throw new Error('Expected choice question');
    choice.answerKey.choiceId = 'not-a-choice';
    expect(() => validateSoundVocabulary(bad)).toThrow();
  });
});
